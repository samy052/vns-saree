const { Op } = require("sequelize");
const Customer = require("../models/Customer");
const WalletTransaction = require("../models/WalletTransaction");
const { sequelize } = require("../config/db");

class WalletService {
  async creditNow({ customerId, amount, type, dedupeKey, meta = null }) {
    return sequelize.transaction(async (t) => {
      const existing = await WalletTransaction.findOne({
        where: { dedupe_key: dedupeKey },
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      if (existing) return existing;

      const tx = await WalletTransaction.create(
        {
          customer_id: customerId,
          amount,
          type,
          status: "completed",
          available_at: null,
          dedupe_key: dedupeKey,
          meta,
        },
        { transaction: t },
      );

      await Customer.increment(
        { wallet_balance: amount },
        { where: { id: customerId }, transaction: t },
      );

      return tx;
    });
  }

  async createPendingCredit({ customerId, amount, type, dedupeKey, availableAt, meta = null }) {
    return sequelize.transaction(async (t) => {
      const existing = await WalletTransaction.findOne({
        where: { dedupe_key: dedupeKey },
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      if (existing) return existing;

      return WalletTransaction.create(
        {
          customer_id: customerId,
          amount,
          type,
          status: "pending",
          available_at: availableAt,
          dedupe_key: dedupeKey,
          meta,
        },
        { transaction: t },
      );
    });
  }

  async processDuePendingCredits({ limit = 200 } = {}) {
    const now = new Date();
    const pending = await WalletTransaction.findAll({
      where: {
        status: "pending",
        available_at: { [Op.lte]: now },
      },
      limit,
      order: [["available_at", "ASC"]],
    });

    for (const tx of pending) {
      // Process sequentially with proper locks for correctness.
      // If multiple instances run, dedupe_key + row locks protect against double credit.
      await sequelize.transaction(async (t) => {
        const locked = await WalletTransaction.findByPk(tx.id, {
          transaction: t,
          lock: t.LOCK.UPDATE,
        });

        if (!locked || locked.status !== "pending") return;

        await Customer.increment(
          { wallet_balance: locked.amount },
          { where: { id: locked.customer_id }, transaction: t },
        );

        locked.status = "completed";
        await locked.save({ transaction: t });
      });
    }

    return { processed: pending.length };
  }
}

module.exports = new WalletService();

