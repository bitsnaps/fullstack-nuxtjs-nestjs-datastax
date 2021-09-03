import { Injectable } from '@nestjs/common';
// const { createClient } = require("@astrajs/rest"); // REST API
const { createClient } = require("@astrajs/collections");
const axios = require('axios');

@Injectable()
export class AppService {

  getHello() {
    return {'msg': 'Hello World!'};
  }

  async getClient() {
    const astraClient = await createClient({
      astraDatabaseId: process.env.ASTRA_DB_ID,
      astraDatabaseRegion: process.env.ASTRA_DB_REGION,
      applicationToken: process.env.ASTRA_DB_APPLICATION_TOKEN
    });

    const collection = astraClient
      .namespace(process.env.ASTRA_DB_KEYSPACE)
      .collection('users');

    return collection;
  }

  // Using the Document API
  async getMembers(): Promise<any> {

    // let members = [{
    //   "id":"3210ed59-5cb4-486b-ba5a-158139213276",
    //   "github":"eddiejaoude",
    //   "location":"Portugal",
    //   "name":"Eddie"
    // },{
    //   "id":"5ea53e52-dd0c-49af-82c2-f3e210530e2f",
    //   "github":"awesomecoder",
    //   "location":"Asia",
    //   "name":"eight"
    // }];

    let members = [];

    const astraClient = await createClient({
      astraDatabaseId: process.env.ASTRA_DB_ID,
      astraDatabaseRegion: process.env.ASTRA_DB_REGION,
      applicationToken: process.env.ASTRA_DB_APPLICATION_TOKEN
    });

    const collection = await this.getClient();

    // Create a documents
    // try {
      // for (var i = 0; i < members.length; i++) {
        // await collection.create(members[i].id, members[i])
      // }
    //   return {
    //     statusCode: 200
    //   }
    // } catch (e) {
    //   console.error(e)
    //   return {
    //     statusCode: 500,
    //     body: JSON.stringify(e)
    //   }
    // } finally {
    // }

    members = collection.find({}).then( (res) => {
      return Object.keys(res).map( (key) => {
        return {
          id: key,
          ...res[key]
        }
      });
    });

    return members;
  }

  // Using the REST API
  async getRestMembers(): Promise<any> {

    /*/ This part uses only Axios without extra dependency
    let members = [];

    const instance = axios.create({
      // Document API
      // baseURL: `https://${process.env.ASTRA_DB_ID}-${process.env.ASTRA_DB_REGION}.apps.astra.datastax.com/api/rest/v2/namespaces/${process.env.ASTRA_DB_KEYSPACE}/collections/`,
      // RESET API
      baseURL: `https://${process.env.ASTRA_DB_ID}-${process.env.ASTRA_DB_REGION}.apps.astra.datastax.com/api/rest/v2/keyspaces/${process.env.ASTRA_DB_KEYSPACE}/`,
      timeout: 30000,
      headers: {
        'X-Cassandra-Token': process.env.ASTRA_DB_APPLICATION_TOKEN,
        'Content-Type': 'application/json'
      }
    })

    // members = await instance.get('users') // Document API
    // members = await instance.get('users/5ea53e52-dd0c-49af-82c2-f3e210530e2f') // Document API
    members = await instance.get('members/5ea53e52-dd0c-49af-82c2-f3e210530e2f') // REST API
      .then((results) => {
        return results.data;
      });*/

    // This part uses the REST API from astrajs
    const restClient = await createClient({
      astraDatabaseId: process.env.ASTRA_DB_ID,
      astraDatabaseRegion: process.env.ASTRA_DB_REGION,
      applicationToken: process.env.ASTRA_DB_APPLICATION_TOKEN
    });

    // const basePath = `/api/rest/v2/namespaces/${process.env.ASTRA_DB_KEYSPACE}/collections/users`;
    const basePath = `/api/rest/v2/keyspaces/${process.env.ASTRA_DB_KEYSPACE}/members`;

    // const { data, status } = await restClient.get(`${basePath}`); // WORKS ONLY WTIH Document API
    const { data, status } = await restClient.get(`${basePath}`, { params:{where:{}} });  // WORKS WTIH REST API

    /*/ get a subdocument by path
    const { data, status } = await restClient.get(
      `${basePath}/5ea53e52-dd0c-49af-82c2-f3e210530e2f` // WORKS WTIH REST API
      // or
      // `${basePath}/5ea53e52-dd0c-49af-82c2-f3e210530e2f/name` // WORKS ONLY WTIH Document API
    );*/

    // search a collection of documents
    // const { data, status } = await restClient.get(basePath, {});

    /*/ search a collection of documents
    const { data, status } = await restClient.get(basePath, {
      params: {
        where: {
          // id: { $eq: "3210ed59-5cb4-486b-ba5a-158139213276" }, // WORKS WITH REST API
          // name: { $eq: "Eddie" }, // WORKS ONLY WITH Document API
          // github: { $eq: "eddiejaoude" }, // WORKS ONLY WITH Document API
        },
      },
    });*/

    // return members;
    return data;
  }

  async postMember(member: any) {
    const collection = await this.getClient();
    // create a new document (a documentId is generated)
    const result = await collection.create({
      name: member.name,
      location: member.location,
      github: member.github,
    });
    return {
      id: result.documentId,
      ...member
    };
  }

  async getMember(name) {
    const collection = await this.getClient();
    const members = await collection.find({ name: { $eq: `${name}` } });
    return Object.keys(members).map( (key) => {
      return {
        id: key,
        ...members[key]
      }
    })
  }

}
