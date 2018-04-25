const fs = require('fs');
const simpleParser = require('mailparser').simpleParser;
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

//
// This function will read a file from disk and return it
// as a string. The Path argument should be the exact path
// to the file to read
//
async function fileLoad(path) {

  return new Promise(resolve => {

    fs.readFile(path, 'utf8', function (err, contents) {

      resolve(contents)

    });

  })

}

//
// This function takes a string that represents an email message
// in mime format and returns the parsed message as an object.
//
async function parseMail(contents) {

  return new Promise((resolve) => {

    simpleParser(contents, (err, mail) => {

      resolve(mail)

    })

  })

}

//
// This function takes a path to a directory and will return
// an array of all files within.
//
async function fileListDirectory(path) {

  return new Promise(resolve => {

    fs.readdir('messages', function (err, files) {

      resolve(files)

    });

  })

}

//
// Main program
//
async function run() {

  //
  // First we need to get a list of the message files.
  //
  const files = await fileListDirectory('messages')

  let messages = [];

  //
  // Now that we have a list of message files we are going
  // to loop through each file and parse it.
  //
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

    //
    // Take the processed message object and add it
    // to an array that will be wrintten to a csv file
    // below.
    //
    messages.push({

      date: message.date,
      to: message.to.text,
      from: message.from.text,
      subject: message.subject

    });

  }

  //
  // Write array of messages to csv file.
  //
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

//
// Start the program
//
run()
