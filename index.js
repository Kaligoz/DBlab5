const connectDB = require('./database');  
const { ObjectId } = require('mongodb'); 
const readline = require('readline');

async function createDocument(collectionName, document) {
  const connection = await connectDB();
  if (!connection) return;

  const { db, client } = connection;
  const collection = db.collection(collectionName);

  const result = await collection.insertOne(document);
  console.log(`Document added to ${collectionName}:`, result.insertedId);

  await client.close();
}

async function readDocuments(collectionName, query = {}) {
  const connection = await connectDB();
  if (!connection) return;

  const { db, client } = connection;
  const collection = db.collection(collectionName);

  const documents = await collection.find(query).toArray();
  console.log(`Documents in ${collectionName}:`, documents);

  await client.close();
}

async function updateDocument(collectionName, updateId, updates) {
  const connection = await connectDB();
  if (!connection) return;

  const { db, client } = connection;
  const collection = db.collection(collectionName);

  const result = await collection.updateOne(
    { _id: new ObjectId(updateId) },
    { $set: updates }
  );
  console.log(`Document ${updateId} updated:`, result.matchedCount);

  await client.close();
}

async function deleteDocument(collectionName, deleteId) {
  const connection = await connectDB();
  if (!connection) return;

  const { db, client } = connection;
  const collection = db.collection(collectionName);

  const result = await collection.deleteOne({ _id: new ObjectId(deleteId) });
  console.log(`Document ${deleteId} deleted:`, result.deletedCount);

  await client.close();
}

async function runApp() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  function prompt(question) {
    return new Promise((resolve) => rl.question(question, resolve));
  }

  let exit = false;
  while (!exit) {
    console.log('\n1. Створити документ (з використанням заготовлених даних)');
    console.log('2. Прочитати документи');
    console.log('3. Оновити документ');
    console.log('4. Видалити документ');
    console.log('5. Вийти');
    const choice = await prompt('Виберіть опцію: ');

    switch (choice) {
      case '1':
        // Predefined document for insertion
        const predefinedDocument = {
          username: "DefaultUser",
          email: "defaultuser@example.com",
          registration_date: new Date(),
          password: "defaultpassword",
        };
        await createDocument("Players", predefinedDocument);
        break;

      case '2':
        await readDocuments("Players"); // Adjust collection name as needed
        break;

      case '3':
        const updateId = await prompt('Введіть ID документа для оновлення: ');
        const updates = { username: "UpdatedUser" }; // Predefined update data
        await updateDocument("Players", updateId, updates);
        break;

      case '4':
        const deleteId = await prompt('Введіть ID документа для видалення: ');
        await deleteDocument("Players", deleteId);
        break;

      case '5':
        exit = true;
        break;

      default:
        console.log('Невірний вибір. Спробуйте ще раз.');
    }
  }

  rl.close();
  console.log('Застосунок завершено.');
}

runApp().catch(console.error);
