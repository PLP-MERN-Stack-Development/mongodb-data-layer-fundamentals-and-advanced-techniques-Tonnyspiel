// queries.js
const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017"; 
const dbName = "plp_bookstore";

async function runQueries() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to database...");

    const db = client.db(dbName);
    const books = db.collection("books");

    // 1️⃣ Find all books in a specific genre
    const fantasyBooks = await books.find({ genre: "Fantasy" }).toArray();
    console.log("Fantasy Books:", fantasyBooks);

    // 2️⃣ Find books published after a certain year
    const recentBooks = await books.find({ published_year: { $gt: 2010 } }).toArray();
    console.log("Books published after 2010:", recentBooks);

    // 3️⃣ Find books by a specific author
    const authorBooks = await books.find({ author: "George Orwell" }).toArray();
    console.log("Books by George Orwell:", authorBooks);

    // 4️⃣ Update the price of a specific book
    await books.updateOne({ title: "The Hobbit" }, { $set: { price: 15.99 } });
    console.log("Updated price of The Hobbit.");

    // 5️⃣ Delete a book by its title
    await books.deleteOne({ title: "Moby Dick" });
    console.log("Deleted 'Moby Dick' from collection.");

    // 6️⃣ Advanced query: Books in stock and published after 2010
    const recentInStock = await books
      .find({ in_stock: true, published_year: { $gt: 2010 } })
      .project({ title: 1, author: 1, price: 1 })
      .toArray();
    console.log("Books in stock and published after 2010:", recentInStock);

    // 7️⃣ Sorting by price
    const sortedBooks = await books.find().sort({ price: 1 }).toArray();
    console.log("Books sorted by price (ascending):", sortedBooks);

    // 8️⃣ Pagination example (5 books per page, skip first 5)
    const page2 = await books.find().skip(5).limit(5).toArray();
    console.log("Page 2 (5 books):", page2);

  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
    console.log("Connection closed.");
  }
}

runQueries();
