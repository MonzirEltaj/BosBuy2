const express =  require('express');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());
app.listen(9000, () => {
    console.log('Server Started at ${9000}')
})

const bcrypt = require('bcrypt');
const saltRounds = 10;

const mongoose = require('mongoose');
const User = require('./UserSchema');
const Card = require('./CardSchema'); 
const Company = require('./CompanySchema');
const Product = require('./ProductSchema');
const Receipt = require('./ReceiptSchema');
const mongoString = "mongodb+srv://nfarinacci:nfarinacci43@clustergroupproject.4jxhotu.mongodb.net/"
mongoose.connect(mongoString)
const database = mongoose.connection
database.on('error', (error) => console.log(error))
database.once('connected', () => console.log('Database Connected'))

app.post('/createAccount', async (req, res) => {
    const { accountType, ...accountDetails } = req.body;
    try {
        // Hash the password before saving
        if (accountDetails.password) {
            const hashedPassword = await bcrypt.hash(accountDetails.password, saltRounds);
            accountDetails.password = hashedPassword;
        }
        
        if (accountType === 'user') {
            // Check for existing user
            const existingUser = await User.findOne({ userId: accountDetails.userId });
            if (existingUser) {
                return res.status(400).send({ message: "UserId already exists for User." });
            }
            const user = new User(accountDetails);
            await user.save();
            res.send(user);
        } else if (accountType === 'company') {
            // Check for existing company
            const existingCompany = await Company.findOne({ name: accountDetails.name });
            if (existingCompany) {
                return res.status(400).send({ message: "Company name already exists." });
            }
            const company = new Company(accountDetails);
            await company.save();
            res.send(company);
        } else {
            res.status(400).send({ message: "Invalid account type." });
        }
    } catch (error) {
        console.error('Error in account creation:', error);
        res.status(500).send({ message: "An error occurred while creating the account.", error });
    }
});

app.get('/getAccount', async (req, res) => {
    const { accountType, userId, name, password } = req.query;

    try {
        let account;
        if (accountType === 'user') {
            account = await User.findOne({ userId });
        } else if (accountType === 'company') {
            account = await Company.findOne({ name });
        }

        if (!account) {
            return res.status(404).send({ message: "Account not found." });
        }

        // Verify hashed password
        const match = await bcrypt.compare(password, account.password);
        if (!match) {
            return res.status(401).send({ message: "Invalid credentials" });
        }

        res.send(account); // Send user details without password
    } catch (error) {
        console.error('Error retrieving account:', error);
        res.status(500).send({ message: "An error occurred while retrieving the account.", error });
    }
});

app.post('/updateProfile', async (req, res) => {
    const { type, id, name, defaultCard, ...updateDetails } = req.body;

    try {
        const model = type === 'user' ? User : Company;

        // For company updates, check for unique company name if it's being changed
        if (type === 'company' && name) {
            const existingCompany = await Company.findOne({ name: name, _id: { $ne: id } });
            if (existingCompany) {
                return res.status(400).send({ success: false, message: "This Company name is already taken." });
            }
        }

        // For user updates, manage the default card update
        if (type === 'user' && defaultCard !== undefined) {
            updateDetails.defaultCard = defaultCard;
        }

        const updatedProfile = await model.findByIdAndUpdate(id, updateDetails, { new: true });
        if (updatedProfile) {
            res.send({ success: true, user: updatedProfile });
        } else {
            res.status(404).send({ success: false, message: "Profile not found." });
        }
    } catch (error) {
        console.error('Update Profile Error:', error);
        res.status(500).send({ message: "An error occurred while updating the profile.", error });
    }
});


app.post('/verifyAndChangePassword', async (req, res) => {
    const { accountType, userId, name, oldPassword, newPassword } = req.body;

    try {
        let account;
        if (accountType === 'user') {
            account = await User.findById(userId);
        } else if (accountType === 'company') {
            account = await Company.findOne({ name });
        } else {
            return res.status(400).send({ message: "Invalid account type specified." });
        }

        if (!account) {
            return res.status(404).send({ success: false, message: "Account not found" });
        }

        const match = await bcrypt.compare(oldPassword, account.password);
        if (!match) {
            return res.status(401).send({ success: false, message: "Old password is incorrect" });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
        account.password = hashedNewPassword;
        await account.save();

        res.send({ success: true, message: "Password updated successfully", user: account });
    } catch (error) {
        console.error('Password change error:', error);
        res.status(500).send({ success: false, message: "Error updating password", error });
    }
});

app.get('/getCompanies', async (req, res) => {
    try {
        const companies = await Company.find({}); // Fetch all companies
        const companyNames = companies.map(company => company.name);
        res.json(companyNames);
    } catch (error) {
        console.error('Error fetching companies:', error);
        res.status(500).send({ message: "An error occurred while retrieving companies." });
    }
});

app.post('/addProduct', async (req, res) => {
    const { name, description, price, imageUrl, soldBy, category, subcategory } = req.body;
    try {
      const product = new Product({ name, description, price, imageUrl, soldBy, category, subcategory });
      await product.save();
      res.status(201).send(product);
    } catch (error) {
      console.error('Failed to add product:', error);
      res.status(500).send({ message: "Failed to add product", error });
    }
  });

  app.get('/getProducts', async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        console.error('Failed to fetch products:', error);
        res.status(500).send({ message: "An error occurred while retrieving products." });
    }
});

app.get('/products/category/:category/:subcategory?', async (req, res) => {
    const { category, subcategory } = req.params;
    const query = { category: category };
    if (subcategory) query.subcategory = subcategory;

    try {
        const products = await Product.find(query);
        res.json(products);
    } catch (error) {
        console.error('Error fetching products by category and subcategory:', error);
        res.status(500).send({ message: "Failed to fetch products", error });
    }
});

app.get('/products/random/:category', async (req, res) => {
    try {
      const { category } = req.params;
      const products = await Product.aggregate([
        { $match: { category: category } },
        { $sample: { size: 3 } }  // Get 3 random documents
      ]);
      res.json(products);
    } catch (error) {
      console.error('Error fetching random products:', error);
      res.status(500).send({ message: "Failed to fetch products", error });
    }
  });

  app.post('/addCard', async (req, res) => {
    const { userId, cardDetails } = req.body;
    try {
        const card = new Card({
            userId: userId,
            cardNumber: cardDetails.cardNumber,
            cardName: cardDetails.cardName,
            expirationDate: cardDetails.expirationDate,
            cvv: cardDetails.cvv,
            zipCode: cardDetails.zipCode
        });
        await card.save();
        await User.findByIdAndUpdate(userId, { $push: { cards: card._id } });
        res.status(201).send({ message: 'Card added successfully', card });
    } catch (error) {
        console.error('Failed to add card:', error);
        res.status(500).send({ message: "Failed to add card", error });
    }
});

app.get('/getCards/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const cards = await Card.find({ userId: userId }); // Fetch all cards for this user
        if (cards.length > 0) {
            res.status(200).send({ success: true, cards: cards });
        } else {
            res.status(404).send({ success: false, message: "No cards found for this user." });
        }
    } catch (error) {
        console.error('Error fetching cards:', error);
        res.status(500).send({ success: false, message: "An error occurred while fetching cards.", error });
    }
});

app.delete('/deleteCard/:cardId', async (req, res) => {
    const { cardId } = req.params;
    try {
        // First, check if the card is set as the default card for any user
        const usersWithDefault = await User.find({ defaultCard: cardId });
        if (usersWithDefault.length > 0) {
            // If the card is the default card, unset it from those users
            await Promise.all(usersWithDefault.map(async (user) => {
                user.defaultCard = null;  // Remove the default card
                await user.save();
            }));
        }

        // Proceed to delete the card using findOneAndDelete for better compatibility
        const result = await Card.findOneAndDelete({ _id: cardId });
        if (result) {
            res.send({ success: true, message: 'Card deleted successfully' });
        } else {
            res.status(404).send({ success: false, message: 'Card not found' });
        }
    } catch (error) {
        console.error('Error deleting card:', error);
        res.status(500).send({ success: false, message: 'Failed to delete card', error });
    }
});

app.put('/editCard/:cardId', async (req, res) => {
    const { cardId } = req.params;
    const cardUpdates = req.body;
    try {
        const updatedCard = await Card.findByIdAndUpdate(cardId, cardUpdates, { new: true });
        if (updatedCard) {
            res.send({ success: true, card: updatedCard });
        } else {
            res.status(404).send({ success: false, message: 'Card not found' });
        }
    } catch (error) {
        console.error('Error updating card:', error);
        res.status(500).send({ success: false, message: 'Failed to update card', error });
    }
});

app.get('/getCard/:cardId', async (req, res) => {
    const { cardId } = req.params;
    try {
        const card = await Card.findById(cardId);
        if (card) {
            res.status(200).send({ success: true, card });
        } else {
            res.status(404).send({ success: false, message: "Card not found" });
        }
    } catch (error) {
        console.error('Error fetching card details:', error);
        res.status(500).send({ success: false, message: "An error occurred while fetching the card details", error });
    }
});

app.post('/saveReceipt', async (req, res) => {
    const { products, totalAmount, cardUsed, user } = req.body;

    try {
        // Determine the next receipt number correctly
        const lastReceipt = await Receipt.findOne({ user }).sort({ receiptCount: -1 });
        const receiptCount = lastReceipt ? lastReceipt.receiptCount + 1 : 0;
        const receiptNumber = `${user}-${receiptCount}`;

        // Create and save the new receipt
        const receipt = new Receipt({
            products,
            totalAmount,
            cardUsed,
            user,
            receiptNumber,
            receiptCount
        });
        await receipt.save();
        res.send({ success: true, message: 'Receipt saved successfully', receipt });
    } catch (error) {
        console.error('Error saving receipt:', error);
        res.status(500).send({ success: false, message: 'Failed to save receipt', error });
    }
});

app.get('/getReceipts/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        const receipts = await Receipt.find({ user: userId }).populate('products.productId').populate('cardUsed');
        if (receipts.length > 0) {
            res.status(200).json(receipts);
        } else {
            res.status(404).json({ message: "No receipts found for this user." });
        }
    } catch (error) {
        console.error('Error fetching receipts:', error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
});

app.get('/getReceipt/:receiptId', async (req, res) => {
    const receiptId = req.params.receiptId;

    try {
        const receipt = await Receipt.findById(receiptId).populate('products.productId').populate('cardUsed');
        if (receipt) {
            res.status(200).json(receipt);
        } else {
            res.status(404).json({ message: "Receipt not found." });
        }
    } catch (error) {
        console.error('Error fetching receipt details:', error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
});

app.get('/getCompanyProducts/:companyName', async (req, res) => {
    try {
        const { companyName } = req.params;
        const products = await Product.find({ soldBy: companyName });
        if (products.length) {
            res.status(200).json(products);
        } else {
            res.status(404).send({ message: "No products found for this company." });
        }
    } catch (error) {
        console.error('Error fetching products for company:', error);
        res.status(500).send({ message: "Failed to fetch products", error });
    }
});

app.get('/getCompaniesData', async (req, res) => {
    try {
        const companies = await Company.find({}, 'name');  // Select only the 'name' field
        const companyData = companies.map(company => ({
            id: company._id,
            name: company.name
        }));
        res.json(companyData);
    } catch (error) {
        console.error('Error fetching companies:', error);
        res.status(500).send('Failed to fetch companies');
    }
});