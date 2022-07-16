const Customer = require('../models/Customer')

module.exports = {
    Query: {
        getCustomerbyId: async (__, args) => {
            try {
                const customer = Customer.findById(args.customer_Id).exec();
                if (customer) {
                    return {
                        message: "Get Customer Success!",
                        status: true,
                        data: customer
                    }
                } else {
                    return {
                        message: "Cannot get Customer!",
                        status: false,
                        data: null
                    }
                }
            } catch (error) {
                return {
                    message: error.message,
                    status: false,
                    data: null
                }
            }
        },
        getCustomers: async (__, args) => {
            const customers = await Customer.find().exec()
            // console.log(customers)
            if (customers) {
                return {
                    message: "Get Customer success!",
                    status: true,
                    data: customers
                }
            }
            if (!customers) {
                return {
                    message: "Cannot Get Customer",
                    status: false,
                    data: null
                }
            }
        }
    },
    Mutation: {
        createCustomer: async (__, args) => {
            try {
                const customer = await new Customer(args.input).save();
                if (customer)
                    return {
                        message: "បង្កើតអតិថិជនជោគជ័យ!",
                        status: true
                    }
            } catch (error) {
                return {
                    message: error.message,
                    status: false
                }
            }

        },
        updateCustomer: async (__, args) => {
            try {
                const updateCustomer = await Customer.findByIdAndUpdate(
                    args.input._id,
                    {
                        ...args.input
                    }
                ).exec();
                if (updateCustomer)
                    return {
                        status: true,
                        message: "កែប្រែអតិថិជនជោគជ័យ!"
                    }
            } catch (error) {
                return {
                    status: false,
                    message: error.message
                }
            }
        },
        deleteCustomer: async (__, args) => {
            try {
                const deleteCustomer = await Customer.findByIdAndDelete(args.customer_Id).exec()
                if (deleteCustomer)
                    return {
                        message: "លុបអតិថិជនជោគជ័យ!",
                        status: true
                    }
            } catch (error) {
                return {
                    message: error.message,
                    status: false
                }
            }
        }
    }
}