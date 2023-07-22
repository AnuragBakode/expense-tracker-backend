const express = require('express')
const router = express.Router()
const Expense = require('../Models/Expense.model')
const { verifyAccessToken } = require('../helpers/jwt_helper')
const User = require('../Models/User.model')

router.post('/expense', verifyAccessToken, async (req, res, next) => {
    try {
        const currentUser = await User.findById(req.payload.aud)

        const newExpense = await new Expense(req.body)
        const savedExpense = await newExpense.save()

        currentUser.expenses.push(savedExpense)
        console.log(currentUser)
        const updatedUser = await currentUser.save()

        console.log(savedExpense)

        res.send(savedExpense)

    } catch (error) {
        next(error)
    }
})

router.get('/expense', verifyAccessToken, async (req, res, next) => {
    try {
        console.log(req.payload.aud)
        const { month, year } = req.query
        console.log(month, year)
        const user = await User.findById(req.payload.aud).populate('expenses')
        console.log(user)
        // const allExpenses = await Expense.find()
        const allExpenses = await user.expenses
        const newExpenses = allExpenses.filter(expense => {
            if (new Date(expense.date).getMonth() === parseInt(month) && new Date(expense.date).getFullYear() === parseInt(year))
                return expense
        })

        const currentUser = await User.findById(req.payload.aud)


        res.send({ expenses: newExpenses, user: { name: currentUser.username } })
    } catch (err) {
        next(err)
    }
})

router.delete('/expense/:expenseId', verifyAccessToken, async (req, res, next) => {
    try {
        console.log("Inside delete script")
        const currentUser = await User.findById(req.payload.aud)
        const currentExpense = await Expense.findById(req.params.expenseId)

        var index = currentUser.expenses.indexOf(currentExpense._id)

        currentUser.expenses.splice(index, 1);
        await currentUser.save();

        const deletedExpense = await Expense.deleteOne({ _id: req.params.expenseId })

        res.send("Deleted Successfully")
    } catch (err) {
        console.log(err)
    }
})

module.exports = router