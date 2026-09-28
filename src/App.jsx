import { useState } from "react";

function App() {

  const [showForm, setShowForm] = useState(false);

  const [transactions, setTransactions] = useState([]);

  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");

  const [categoryFilter, setCategoryFilter] = useState("all");

  const [typeFilter, setTypeFilter] = useState("all");


  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    type: "expense",
    category: "food",
    date: "",
  });

  const totalIncome = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const totalExpenses = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const balance = totalIncome - totalExpenses;

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = transaction.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" ||
      transaction.category === categoryFilter;

    const matchesType =
      typeFilter === "all" ||
      transaction.type === typeFilter;

    return matchesSearch && matchesCategory && matchesType;
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Add transaction
  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingId !== null) {
      // Update existing transaction
      setTransactions(
        transactions.map((transaction) =>
          transaction.id === editingId
            ? {
              ...transaction,
              title: formData.title,
              amount: Number(formData.amount),
              type: formData.type,
              category: formData.category,
            }
            : transaction
        )
      );
    } else {
      // Add new transaction
      const newTransaction = {
        id: Date.now(),
        title: formData.title,
        amount: Number(formData.amount),
        type: formData.type,
        category: formData.category,
        date: formData.date,
      };

      setTransactions([...transactions, newTransaction]);
    }

    // Reset
    setFormData({
      title: "",
      amount: "",
      type: "expense",
      category: "food",
      date: "",
    });

    setEditingId(null);
    setShowForm(false);
  };

  const handleDelete = (id) => {
    setTransactions(
      transactions.filter((transaction) => transaction.id !== id)
    );
  };

  const handleEdit = (transaction) => {
    setFormData({
      title: transaction.title,
      amount: transaction.amount,
      type: transaction.type,
      category: transaction.category,
      date: transaction.date,
    });

    setEditingId(transaction.id);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Expense Tracker
        </h1>

        <p className="mt-1 text-gray-500">
          Track your income and expenses
        </p>
      </header>

      {/* Summary Cards */}
      <div className="grid gap-5 md:grid-cols-3">

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Balance
          </p>

          <h2 className="mt-2 text-3xl font-bold text-gray-900">
            ₹{balance.toLocaleString("en-IN")}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Income
          </p>

          <h2 className="mt-2 text-3xl font-bold text-green-600">
            ₹{totalIncome.toLocaleString("en-IN")}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Expenses
          </p>

          <h2 className="mt-2 text-3xl font-bold text-red-600">
            ₹{totalExpenses.toLocaleString("en-IN")}
          </h2>
        </div>

      </div>

      {/* Transactions */}
      <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">

        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            Recent Transactions
          </h2>

          <button
            onClick={() => setShowForm(true)}
            className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            + Add Transaction
          </button>
        </div>

        {/* Search & Filters */}
        <div className="mt-6 grid gap-3 md:grid-cols-3">

          {/* Search */}
          <input
            type="text"
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-black"
          />

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-black"
          >
            <option value="all">All Categories</option>
            <option value="food">Food</option>
            <option value="shopping">Shopping</option>
            <option value="transport">Transport</option>
            <option value="bills">Bills</option>
            <option value="salary">Salary</option>
            <option value="other">Other</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-black"
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

        </div>

        {/* Transaction List */}
        <div className="mt-6 border-t border-gray-200 pt-4">

          {filteredTransactions.length === 0 ? (
            <p className="text-gray-500">
              {transactions.length === 0
                ? "No transactions yet."
                : "No transactions match your filters."}
            </p>
          ) : (
            <div className="space-y-3">

              {filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between rounded-lg border border-gray-200 p-4"
                >

                  <div>
                    <h3 className="font-medium text-gray-900">
                      {transaction.title}
                    </h3>

                    <p className="text-sm capitalize text-gray-500">
                      {transaction.category} • {formatDate(transaction.date)}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">

                    <p
                      className={`font-semibold ${transaction.type === "income"
                        ? "text-green-600"
                        : "text-red-600"
                        }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}
                      ₹{transaction.amount.toLocaleString("en-IN")}
                    </p>

                    <button
                      onClick={() => handleEdit(transaction)}
                      className="rounded-lg px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(transaction.id)}
                      className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>



                  </div>

                </div>
              ))}

            </div>
          )}

        </div>

      </div>

      {/* Add Transaction Modal */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 p-4">

          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">

            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {editingId !== null ? "Edit Transaction" : "Add Transaction"}
              </h2>

              <button
                onClick={() => setShowForm(false)}
                className="text-2xl text-gray-400 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >

              {/* Title */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Grocery Shopping"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-black"
                />
              </div>

              {/* Amount */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Amount
                </label>

                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="Enter amount"
                  min="1"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-black"
                />
              </div>

              {/* Date */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Date
                </label>

                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-black"
                />
              </div>

              {/* Type */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Type
                </label>

                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-black"
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Category
                </label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-black"
                >
                  <option value="food">Food</option>
                  <option value="shopping">Shopping</option>
                  <option value="transport">Transport</option>
                  <option value="bills">Bills</option>
                  <option value="salary">Salary</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full rounded-lg bg-black py-2.5 font-medium text-white hover:bg-gray-800"
              >
                Add Transaction
              </button>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}

export default App;