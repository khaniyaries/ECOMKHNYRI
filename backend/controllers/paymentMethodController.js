import PaymentMethod from '../models/paymentMethod.js';

export const getAllPaymentMethods = async (req, res) => {
try {
    const paymentMethods = await PaymentMethod.find({ userId: req.query.userId });
    res.status(200).json(paymentMethods);
    } catch (error) {
    res.status(500).json({ message: 'Error fetching payment methods' });
    }    
};

export const addPaymentMethod = async (req, res) => {
try {
    const newPaymentMethod = new PaymentMethod({
        userId: req.body.userId,
        cardNumber: req.body.cardNumber,
        cardHolder: req.body.cardHolder,
        expiry: req.body.expiry,
        type: req.body.type
    });
    await newPaymentMethod.save();
    res.status(201).json(newPaymentMethod);
    } catch (error) {
    res.status(500).json({ message: 'Error adding payment method' });
    }
};

export const deletePaymentMethod = async (req, res) => {
  try {
    await PaymentMethod.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Payment method deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting payment method' });
  }
};
