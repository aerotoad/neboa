import { describe, expect, it } from "vitest";
import { Neboa } from "../../classes/neboa";

describe('Escaped characters', () => {

  it('Should be able to insert a document with escaped characters', () => {
    const neboa = new Neboa(':memory:');
    const collection = neboa.collection('test');

    const doubleQuoteDoc = collection.insert(doubleQuote);
    const singleQuoteDoc = collection.insert(singleQuote);
    const backtickDoc = collection.insert(backtick);
    const backslashDoc = collection.insert(backslash);
    const newlineDoc = collection.insert(newline);
    const carriageReturnDoc = collection.insert(carriageReturn);
    const tabDoc = collection.insert(tab);
    const backspaceDoc = collection.insert(backspace);
    const formFeedDoc = collection.insert(formFeed);

    expect(doubleQuoteDoc).toBeDefined();
    expect(singleQuoteDoc).toBeDefined();
    expect(backtickDoc).toBeDefined();
    expect(backslashDoc).toBeDefined();
    expect(newlineDoc).toBeDefined();
    expect(carriageReturnDoc).toBeDefined();
    expect(tabDoc).toBeDefined();
    expect(backspaceDoc).toBeDefined();
    expect(formFeedDoc).toBeDefined();

    expect(doubleQuoteDoc.description).toBe(doubleQuote.description);
    expect(singleQuoteDoc.description).toBe(singleQuote.description);
    expect(backtickDoc.description).toBe(backtick.description);
    expect(backslashDoc.description).toBe(backslash.description);
    expect(newlineDoc.description).toBe(newline.description);
    expect(carriageReturnDoc.description).toBe(carriageReturn.description);
    expect(tabDoc.description).toBe(tab.description);
    expect(backspaceDoc.description).toBe(backspace.description);
    expect(formFeedDoc.description).toBe(formFeed.description);
  })

  it('Should be able to insert multiple documents with escaped characters', () => {
    const neboa = new Neboa(':memory:');
    const collection = neboa.collection('test');

    const insertedDocuments = collection.insertMany([
      doubleQuote,
      singleQuote,
      backtick,
      backslash,
      newline,
      carriageReturn,
      tab,
      backspace,
      formFeed
    ]);

    expect(insertedDocuments).toBeDefined();
    expect(insertedDocuments.length).toBe(9);
    expect(insertedDocuments[0].description).toBe(doubleQuote.description);
    expect(insertedDocuments[1].description).toBe(singleQuote.description);
    expect(insertedDocuments[2].description).toBe(backtick.description);
    expect(insertedDocuments[3].description).toBe(backslash.description);
    expect(insertedDocuments[4].description).toBe(newline.description);
    expect(insertedDocuments[5].description).toBe(carriageReturn.description);
    expect(insertedDocuments[6].description).toBe(tab.description);
    expect(insertedDocuments[7].description).toBe(backspace.description);
    expect(insertedDocuments[8].description).toBe(formFeed.description);


  })

  it('Should be able to update a document with escaped characters', () => {
    const neboa = new Neboa(':memory:');
    const collection = neboa.collection('test');

    const insertedDocument = collection.insert({
      name: 'test',
      description: 'This is a test description'
    });
    expect(insertedDocument).toBeDefined();

    const doubleQuoteDoc = collection.update(insertedDocument._id, doubleQuote);
    const singleQuoteDoc = collection.update(insertedDocument._id, singleQuote);
    const backtickDoc = collection.update(insertedDocument._id, backtick);
    const backslashDoc = collection.update(insertedDocument._id, backslash);
    const newlineDoc = collection.update(insertedDocument._id, newline);
    const carriageReturnDoc = collection.update(insertedDocument._id, carriageReturn);
    const tabDoc = collection.update(insertedDocument._id, tab);
    const backspaceDoc = collection.update(insertedDocument._id, backspace);
    const formFeedDoc = collection.update(insertedDocument._id, formFeed);

    expect(doubleQuoteDoc).toBeDefined();
    expect(singleQuoteDoc).toBeDefined();
    expect(backtickDoc).toBeDefined();
    expect(backslashDoc).toBeDefined();
    expect(newlineDoc).toBeDefined();
    expect(carriageReturnDoc).toBeDefined();
    expect(tabDoc).toBeDefined();
    expect(backspaceDoc).toBeDefined();
    expect(formFeedDoc).toBeDefined();

    expect(doubleQuoteDoc.description).toBe(doubleQuote.description);
    expect(singleQuoteDoc.description).toBe(singleQuote.description);
    expect(backtickDoc.description).toBe(backtick.description);
    expect(backslashDoc.description).toBe(backslash.description);
    expect(newlineDoc.description).toBe(newline.description);
    expect(carriageReturnDoc.description).toBe(carriageReturn.description);
    expect(tabDoc.description).toBe(tab.description);
    expect(backspaceDoc.description).toBe(backspace.description);
    expect(formFeedDoc.description).toBe(formFeed.description);
  })

  it('Should be able to update multiple documents with escaped characters', () => {
    const neboa = new Neboa(':memory:');
    const collection = neboa.collection('test');

    const insertedDocuments = collection.insertMany([
      doubleQuote,
      singleQuote,
      backtick,
      backslash,
      newline,
      carriageReturn,
      tab,
      backspace,
      formFeed
    ]);

    expect(insertedDocuments).toBeDefined();
    expect(insertedDocuments.length).toBe(9);

    const updatedDocuments = collection.updateMany(insertedDocuments.map(doc => doc._id), [
      doubleQuote,
      singleQuote,
      backtick,
      backslash,
      newline,
      carriageReturn,
      tab,
      backspace,
      formFeed
    ]);

    expect(updatedDocuments).toBeDefined();
    expect(updatedDocuments.length).toBe(9);
    expect(updatedDocuments[0].description).toBe(doubleQuote.description);
    expect(updatedDocuments[1].description).toBe(singleQuote.description);
    expect(updatedDocuments[2].description).toBe(backtick.description);
    expect(updatedDocuments[3].description).toBe(backslash.description);
    expect(updatedDocuments[4].description).toBe(newline.description);
    expect(updatedDocuments[5].description).toBe(carriageReturn.description);
    expect(updatedDocuments[6].description).toBe(tab.description);
    expect(updatedDocuments[7].description).toBe(backspace.description);
    expect(updatedDocuments[8].description).toBe(formFeed.description);

  })

});

const doubleQuote = {
  name: 'test',
  description: 'This is a test "description"'
};

const singleQuote = {
  name: 'test',
  description: "This is a test 'description'"
};

const backtick = {
  name: 'test',
  description: 'This is a test `description`'
};

const backslash = {
  name: 'test',
  description: 'This is a test \\description\\'
};

const newline = {
  name: 'test',
  description: 'This is a test \ndescription\n'
};

const carriageReturn = {
  name: 'test',
  description: 'This is a test \rdescription\r'
};

const tab = {
  name: 'test',
  description: 'This is a test \tdescription\t'
};

const backspace = {
  name: 'test',
  description: 'This is a test \bdescription\b'
};

const formFeed = {
  name: 'test',
  description: 'This is a test \fdescription\f'
};
