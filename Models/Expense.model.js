const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ExpenseSchema = new Schema({
    description: {
        type: String,
        required: true
    },

    amount: {
        type: Number,
        required: true
    },

    date: {
        type: Date,
        required: true
    }
})

const Expense = mongoose.model('expense', ExpenseSchema)
module.exports = Expense

