import Transaction from "../models/transaction.model.js";

const transactionResolver = {
  Query: {
    transactions: async (_, __, context) => {
      try {
        if (!context.getUser()) throw new Error("Unauthorized");

        const userId = await context.getUser()._id;
        const transactions = await Transaction.find({ userId });

        return transactions;
      } catch (err) {
        console.log("Error getting transactions: ", err);
        throw new Error("Error getting transactions: ", err);
      }
    },
    transaction: async (_, { transactionId }) => {
      try {
        const transaction = await Transaction.findById(transactionId);
        return transaction;
      } catch (err) {
        console.log("Error getting transaction: ", err);
        throw new Error("Error getting transaction: ", err);
      }
    },
  },
  Mutation: {
    createTransaction: async (_, { input }, context) => {
      try {
        const newTransaction = new Transaction({
          ...input,
          userId: context.getUser()._id,
        });
        const transaction = await newTransaction.save();
        return transaction;
      } catch (err) {
        console.log("Error creating transaction: ", err);
        throw new Error("Error creating transaction: ", err);
      }
    },
    updateTransaction: async (_, { input }) => {
      try {
        const updatedTransaction = await Transaction.findByIdAndUpdate(
          input.transactionId,
          input,
          { new: true }
        );
        return updatedTransaction;
      } catch (err) {
        console.log("Error updating transaction: ", err);
        throw new Error("Error updating transaction: ", err);
      }
    },
    deleteTransaction: async (_, { transactionId }) => {
      try {
        const deletedTransaction = await Transaction.findByIdAndDelete(
          transactionId
        );
        return deletedTransaction;
      } catch (err) {
        console.log("Error deleting transaction: ", err);
        throw new Error("Error deleting transaction: ", err);
      }
    },
  },
};

export default transactionResolver;
