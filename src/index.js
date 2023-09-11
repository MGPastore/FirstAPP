
const express = require('express')
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: true, // Cambiar a 'false' si estás usando una certificación autofirmada
    },
  },
});
/*// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize('test', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
  });

  */
const app = express()
const port = 3000

var cors = require('cors')
app.use(cors())
app.use(express.json());
var sanitize = require("./middleware/sanitize")
app.use(sanitize)

// Modelos Sequelize
const Form = sequelize.define('Form', {
  id: {
    type: Sequelize.STRING(36),
    primaryKey: true,
  },
  createdAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
  },
  updatedAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
    onUpdate: Sequelize.NOW,
  },
});

const Question = sequelize.define('Question', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    unique: true,
  },
  userId: {
    type: Sequelize.STRING(36),
    allowNull: false,
  },
  text: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  createdAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
  },
  updatedAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
    onUpdate: Sequelize.NOW,
  },
});

const Response = sequelize.define('Response', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  formId: {
    type: Sequelize.STRING(36),
    allowNull: false,
    references: {
      model: Form,
      key: 'id',
    },
  },
  questionId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: Question,
      key: 'id',
    },
  },
  answer: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  createdAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
  },
  updatedAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
    onUpdate: Sequelize.NOW,
  },
});

// Sincronizar modelos con la base de datos
sequelize.sync()
  .then(() => {
    console.log('Tablas sincronizadas con la base de datos.');
  })
  .catch(error => {
    console.error('Error al sincronizar tablas:', error);
  });

  app.get('/GET/Response/:ID', async (req, res) => {
    let data = await Response.findAll({
    where: {
      formId: req.params.ID
    }});
    console.log(data)
    res.json(data)
  })

app.get('/GET/Question/:ID', async (req, res) => {
  let data = await Question.findAll({
    where: {
      userId: req.params.ID
    }
  })
  console.log(data)
  res.json(data)
})

app.post("/POST/:IDFORM/Response", async (req, res) => {

  try {
    //await Form.create({id: 1})
    //await Response.create({formId:1,questionId:1,answer:"Gabriel"})
    console.log(req.body)
    await Response.bulkCreate(req.body)
    res.json(json = "postDataOK")

  } catch (error) {
    res.json(error)
  }


})


app.get('/POST/Question', async (req, res) => {
  try {
    
     const data = [
       { text: '¿En que horario se encuentra en el LATU? (MAÑANA/TARDE/NOCHE)',
       userId: 'Diseño' },
       { text: '¿Estudias o Trabajas?',
       userId: 'Diseño' },
       { text: '¿En que edificio haces tus activiades?',
       userId: 'Diseño' },
       { text: '¿Cual es el lugar mas comodo del Parque del LATU?',
       userId: 'Diseño' },
       { text: '¿Cuanto tiene de descanso? ',
       userId: 'Diseño' },
       { text: '¿Que actividades hace en el parque del LATU? ',
       userId: 'Diseño' },
       { text: '¿Tiene tiempo libre antes de sus actividades del LATU? ',
       userId: 'Diseño' },
       { text: '¿A donde vas en tus descansos en dia de lluvia o frio ? ',
       userId: 'Diseño' },
       { text: '¿Tiene algun lugar privado para su descanso ? ',
       userId: 'Diseño' },
       { text: '¿Que mobiliario agregarias al parque del LATU? ',
       userId: 'Diseño' },
       { text: '¿Compartes el mobiliario urbano con otros miembros del LATU? ',
       userId: 'Diseño' },
       { text: '¿Cuantos miembros de su empresa o clase salen al mismo tiempo a descansar? ',
       userId: 'Diseño' },
       { text: '¿Que mobiliario crees que hace falta en el parque del LATU? ',
       userId: 'Diseño' },
     ];
  
    //var data = req.body
    await Question.bulkCreate(data);

    res.json(json = "newQuestionOK")
  } catch (error) {
    res.json('Error al crear preguntas');
  }
});


app.use('/public', express.static(__dirname + '/public'));

app.listen(port, async () => {
  console.log(`Example app listening on port ${port}`)
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})


module.exports = { Response, Question, Form }