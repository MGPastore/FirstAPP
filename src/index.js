
const express = require('express')
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('postgres://root:4bzeDmV6kKwEhR4F82PxNBJqnRGWxVbA@dpg-cjnusv4dfrcc73a11gog-a.oregon-postgres.render.com/test_t932') // Example for postgres
/*// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize('test', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
  });

  */
const app = express()
const port = 3000



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
    },
    userId: {
        type: Sequelize.STRING(36),
        primaryKey: true,
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
  

app.get('/GET/Question/:ID', async (req, res) => {
    var data =  await Question.findAll({
        where: {
            userId : req.params.ID
        }
      })
      console.log(data)
      res.json(data)
})

app.get("/POST",async(req,res)=>{
   //await Form.create({id: 1})
   await Response.create({formId:1,questionId:1,answer:"Gabriel"})





})


  app.get('/question', async (req, res) => {
    try {
      const data = [
        { text: '¿Cómo te llamas?',
        userId: 'MGP' },
        { text: '¿Cuál es tu edad?',
        userId: 'MGP' },
        { text: '¿Cuál es tu ciudad natal?',
        userId: 'MGP' },
      ];
  
      await Question.bulkCreate(data);
  
      res.json('Preguntas agregadas correctamente :)')
    } catch (error) {
      res.json('Error al crear preguntas');
    }
  });
app.listen(port, async () => {
  console.log(`Example app listening on port ${port}`)
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})


module.exports = {Response, Question, Form  }