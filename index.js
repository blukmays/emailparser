const fs = require('fs');
const simpleParser = require('mailparser').simpleParser;
const createCsvWriter = require('csv-writer').createObjectCsvWriter;



async function fileLoad(path) {

  return new Promise(resolve => {

    fs.readFile(path, 'utf8', function (err, contents) {

      resolve(contents)

    });

  })

}


async function parseMail(contents) {

  return new Promise((resolve) => {

    simpleParser(contents, (err, mail) => {

      resolve(mail)

    })

  })

}



async function fileListDirectory(path) {

  return new Promise(resolve => {

    fs.readdir('messages', function (err, files) {

      resolve(files)

    });

  })

}


async function run() {


  const files = await fileListDirectory('messages')

  let messages = [];


  for (let i = 0; i < files.length; i++) {

    const message = await parseMail(await fileLoad(`messages/${files[i]}`));

    const date = message.date;
    const to = message.to.text;
    const from = message.from.text;
    const subject = message.subject;

    console.log('---')
    console.log(`date: ${date}`)
    console.log(`to: ${to}`)
    console.log(`from: ${from}`)
    console.log(`subject: ${subject}`)


    messages.push({

      date: message.date,
      to: message.to.text,
      from: message.from.text,
      subject: message.subject

    });

  }


  const csvWriter = createCsvWriter({

    path: 'output.csv',
    header: [
      { id: 'date', title: 'date' },
      { id: 'to', title: 'to' },
      { id: 'from', title: 'from' },
      { id: 'subject', title: 'subject' },
    ]

  });

  csvWriter.writeRecords(messages).then(() => {

    console.log('Created output.csv');

  });

}


run()
