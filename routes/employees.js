const express = require('express');
const mongoose = require('mongoose');  // Import mongoose
const Employee = require('../models/Employee');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// GET: Fetch all employees
router.get('/employees', async (req, res) => {
    try {
        const employees = await Employee.find();

        // Modify the response to match the assignment output
        const modifiedEmployees = employees.map(employee => ({
            employee_id: employee._id,
            first_name: employee.first_name,
            last_name: employee.last_name,
            email: employee.email,
            position: employee.position,
            salary: employee.salary,
            date_of_joining: employee.date_of_joining,
            department: employee.department
        }));

        res.status(200).json(modifiedEmployees);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


// POST: Create a new employee
router.post('/employees', [
    body('first_name').notEmpty().withMessage('First name is required'),
    body('last_name').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('position').notEmpty().withMessage('Position is required'),
    body('salary').isNumeric().withMessage('Salary must be a number'),
    body('date_of_joining').isISO8601().withMessage('Valid date is required'),
    body('department').notEmpty().withMessage('Department is required')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { first_name, last_name, email, position, salary, date_of_joining, department } = req.body;

    try {
        let employee = new Employee({
            first_name,
            last_name,
            email,
            position,
            salary,
            date_of_joining,
            department
        });

        await employee.save();
        res.status(201).json({ message: 'Employee created successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// GET: Fetch employee by ID
router.get('/employees/:id', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json(employee);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// PUT: Update employee by ID
router.put('/employees/:id', [
    body('first_name').optional().notEmpty().withMessage('First name is required'),
    body('last_name').optional().notEmpty().withMessage('Last name is required'),
    body('email').optional().isEmail().withMessage('Valid email is required'),
    body('position').optional().notEmpty().withMessage('Position is required'),
    body('salary').optional().isNumeric().withMessage('Salary must be a number'),
    body('date_of_joining').optional().isISO8601().withMessage('Valid date is required'),
    body('department').optional().notEmpty().withMessage('Department is required')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Check if the ID is valid
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid employee ID' });
        }

        const { first_name, last_name, email, position, salary, date_of_joining, department } = req.body;

        // Prepare the updated fields
        const updatedEmployee = {
            first_name,
            last_name,
            email,
            position,
            salary,
            date_of_joining,
            department,
            updated_at: Date.now() // Update the timestamp
        };

        // Find the employee by ID and update their details
        const employee = await Employee.findByIdAndUpdate(
            req.params.id,
            { $set: updatedEmployee },
            { new: true } // Return the updated document
        );

        // If employee is not found
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.status(200).json({ message: 'Employee updated successfully', employee });
    } catch (err) {
        console.error('Error updating employee:', err.message);
        res.status(500).send('Server error');
    }
});

// DELETE: Delete employee by ID
router.delete('/employees/:id', async (req, res) => {
    try {
        // Check if the ID is valid
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid employee ID' });
        }

        // Find and delete the employee using findByIdAndDelete
        const employee = await Employee.findByIdAndDelete(req.params.id);
        
        // If employee is not found
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // Return success message
        res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (err) {
        console.error('Error deleting employee:', err.message);  // Log the actual error
        res.status(500).send('Server error');
    }
});

module.exports = router;
