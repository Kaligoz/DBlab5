const connectDB = require('./database'); // Import connectDB correctly
const { ObjectId } = require('mongodb'); // Import ObjectId here

async function setupDatabase() {
  const connection = await connectDB(); // Get db and client as an object

  if (!connection) {
    console.error("Database connection failed");
    return;
  }

  const { db, client } = connection; // Destructure db and client
  console.log("DB and Client:", db, client);

  const teamsCollection = db.collection('Teams');
  const playersCollection = db.collection('Players');
  const charactersCollection = db.collection('Characters');
  const sessionsCollection = db.collection('Sessions');
  const weaponsCollection = db.collection('Weapons');

  // Insert a sample team
  const teamId = await teamsCollection.insertOne({
    team_name: 'Warriors',
    number_players: 5,
    total_points: 1000,
    members: []
  });

  // Insert a sample player
  await playersCollection.insertOne({
    username: 'PlayerOne',
    email: 'playerone@example.com',
    registration_date: new Date('2021-08-01T12:00:00Z'),
    password: 'password',
  });

  // Insert a sample character
  await charactersCollection.insertOne({
    level: '10',
    rank: 'Diamond',
    class: 'Warrior',
    player_id: new ObjectId(), 
  });

  // Insert a sample session
  await sessionsCollection.insertOne({
    time_started: new Date('2021-08-01T12:00:00Z'),
    time_ended: new Date('2021-08-01T13:30:00Z'),
    team_id: teamId.insertedId,
  });

  // Insert a sample weapon
  await weaponsCollection.insertOne({
    weapon_name: 'Excalibur',
    type: 'Sword',
    damage: 100,
    durability: 100,
    character_id: new ObjectId(),
  });

  console.log('Database setup complete');

  // Function to run queries
  async function runQueries() {
    const charactersWithPlayers = await db.collection('Characters').aggregate([
      {
        $lookup: {
          from: 'Players',          // The collection to join with
          localField: 'player_id',  // The field in 'Characters' to match with 'Players'
          foreignField: '_id',      // The field in 'Players' collection to match 'player_id' in 'Characters'
          as: 'player_info'         // The name of the new array to store joined data
        }
      }
    ]).toArray();
    console.log(charactersWithPlayers);   
    
    const playersWithTeams = await db.collection('Players').aggregate([
      {
        $lookup: {
          from: 'Teams',           // The collection to join with
          localField: 'team_id',    // The field in 'Players' collection to match with 'Teams'
          foreignField: '_id',      // The field in 'Teams' collection to match with 'team_id' in 'Players'
          as: 'team_info'           // The name of the new array to store joined data
        }
      }
    ]).toArray();
    console.log(playersWithTeams);
  }
  
  await runQueries();
  await client.close(); 
}

setupDatabase().catch(console.error);
