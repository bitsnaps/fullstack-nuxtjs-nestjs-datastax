# FullStack App with NuxtJS, NestJS and DataStax

A demo web app using Nest.js, Next.js to interact with AstraDB.

# Setup ui
The `ui` is built with Nuxt.js framework:
```
npm init nuxt-app ui
cd ui
npm run dev
```
Notes: We selected: vuetify as css framework, SPA for the type of the application, axios for http request.

# Setup api
The `api` is a Nest.js project:
```
sudo npm install -g @nestjs/cli
nest new api
cd api
npm install --save @astrajs/collections
npm install --save @nestjs/config
npm run start:dev
```
# AstraDB API

The following examples demonstrate how to use both Document API and REST API to interact with AstraDB.

## The Document API

The Document API allows you to store data without a Schema, it will create a default schema like so (in this example: keyspace=`ks01`, table=`users`):
```sql
CREATE TABLE ks01.users (
    key text,
    p0 text,
    p1 text,
    p2 text,
    p3 text,
    p4 text,
    p5 text,
    p6 text,
    p7 text,
    p8 text,
    p9 text,
    p10 text,
    p11 text,
    p12 text,
    p13 text,
    p14 text,
    p15 text,
    p16 text,
    p17 text,
    p18 text,
    p19 text,
    p20 text,
    p21 text,
    p22 text,
    p23 text,
    p24 text,
    p25 text,
    p26 text,
    p27 text,
    p28 text,
    p29 text,
    p30 text,
    p31 text,
    p32 text,
    p33 text,
    p34 text,
    p35 text,
    p36 text,
    p37 text,
    p38 text,
    p39 text,
    p40 text,
    p41 text,
    p42 text,
    p43 text,
    p44 text,
    bool_value tinyint,
    dbl_value double,
    leaf text,
    text_value text,
    PRIMARY KEY (key, p0, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13, p14, p15, p16, p17, p18, p19, p20, p21, p22, p23, p24, p25, p26, p27, p28, p29, p30, p31, p32, p33, p34, p35, p36, p37, p38, p39, p40, p41, p42, p43, p44)
) WITH CLUSTERING ORDER BY (p0 ASC, p1 ASC, p2 ASC, p3 ASC, p4 ASC, p5 ASC, p6 ASC, p7 ASC, p8 ASC, p9 ASC, p10 ASC, p11 ASC, p12 ASC, p13 ASC, p14 ASC, p15 ASC, p16 ASC, p17 ASC, p18 ASC, p19 ASC, p20 ASC, p21 ASC, p22 ASC, p23 ASC, p24 ASC, p25 ASC, p26 ASC, p27 ASC, p28 ASC, p29 ASC, p30 ASC, p31 ASC, p32 ASC, p33 ASC, p34 ASC, p35 ASC, p36 ASC, p37 ASC, p38 ASC, p39 ASC, p40 ASC, p41 ASC, p42 ASC, p43 ASC, p44 ASC)
    AND additional_write_policy = '99PERCENTILE'
    AND bloom_filter_fp_chance = 0.01
    AND caching = {'keys': 'ALL', 'rows_per_partition': 'NONE'}
    AND comment = ''
    AND compaction = {'class': 'org.apache.cassandra.db.compaction.UnifiedCompactionStrategy'}
    AND compression = {'chunk_length_in_kb': '64', 'class': 'org.apache.cassandra.io.compress.LZ4Compressor'}
    AND crc_check_chance = 1.0
    AND default_time_to_live = 0
    AND gc_grace_seconds = 864000
    AND max_index_interval = 2048
    AND memtable_flush_period_in_ms = 0
    AND min_index_interval = 128
    AND read_repair = 'BLOCKING'
    AND speculative_retry = '99PERCENTILE';
CREATE CUSTOM INDEX users_bool_value_idx ON ks01.users (bool_value) USING 'StorageAttachedIndex';
CREATE CUSTOM INDEX users_text_value_idx ON ks01.users (text_value) USING 'StorageAttachedIndex';
CREATE CUSTOM INDEX users_leaf_idx ON ks01.users (leaf) USING 'StorageAttachedIndex';
CREATE CUSTOM INDEX users_dbl_value_idx ON ks01.users (dbl_value) USING 'StorageAttachedIndex';
```
In order to select values you can run the following query:
```sql
SELECT key, p0, leaf, text_value FROM users ;
```

Create a collection using Document API:

```bash
curl --request POST \
  --url https://${ASTRA_DB_ID}-${ASTRA_DB_REGION}.apps.astra.datastax.com/api/rest/v2/namespaces/${ASTRA_DB_KEYSPACE}/collections/members \
  -H "X-Cassandra-Token: ${ASTRA_DB_APPLICATION_TOKEN}" \
  -H 'Content-Type: application/json' \
  -d '{
  "id":"3210ed59-5cb4-486b-ba5a-158139213276",
  "github":"eddiejaoude",
  "location":"Portugal",
  "name":"Eddie"
  },
  {
  "id":"5ea53e52-dd0c-49af-82c2-f3e210530e2f",
  "github":"awesomecoder",
  "location":"Asia",
  "name":"eight"
  }'
```

## REST API

Using REST API you must define a schema before adding data:

## Create a schema
```bash
curl --request POST \
    --url https://${ASTRA_DB_ID}-${ASTRA_DB_REGION}.apps.astra.datastax.com/api/rest/v2/schemas/keyspaces/${ASTRA_DB_KEYSPACE}/tables \
    --header 'content-type: application/json' \
    --header "x-cassandra-token: ${ASTRA_DB_APPLICATION_TOKEN}" \
    --data '{"name":"members","ifNotExists":true,"columnDefinitions": [ {"name":"id","typeDefinition":"uuid","static":false}, {"name":"github","typeDefinition":"text","static":false}, {"name":"location","typeDefinition":"text","static":false}, {"name":"name","typeDefinition":"text","static":false}],"primaryKey": {"partitionKey":["id"]},"tableOptions":{"defaultTimeToLive":0}}'
```

## Add some rows
```bash
curl --request POST \
    --url https://${ASTRA_DB_ID}-${ASTRA_DB_REGION}.apps.astra.datastax.com/api/rest/v2/keyspaces/${ASTRA_DB_KEYSPACE}/members \
    --header 'content-type: application/json' \
    --header "x-cassandra-token: ${ASTRA_DB_APPLICATION_TOKEN}" \
    --data '{
    "id":"3210ed59-5cb4-486b-ba5a-158139213276",
    "github":"eddiejaoude",
    "location":"Portugal",
    "name":"Eddie"
    }'

curl --request POST \
    --url https://${ASTRA_DB_ID}-${ASTRA_DB_REGION}.apps.astra.datastax.com/api/rest/v2/keyspaces/${ASTRA_DB_KEYSPACE}/members \
    --header "content-type: application/json" \
    --header "x-cassandra-token: ${ASTRA_DB_APPLICATION_TOKEN}" \
    --data '{
    "id":"5ea53e52-dd0c-49af-82c2-f3e210530e2f",
    "github":"awesomecoder",
    "location":"Asia",
    "name":"eight"
    }'    
```

## Retrieve multiple rows
```bash
# By default GET returns one row, add '&page-size=20' to get more results
curl --request GET \
    --url https://${ASTRA_DB_ID}-${ASTRA_DB_REGION}.apps.astra.datastax.com/api/rest/v2/keyspaces/${ASTRA_DB_KEYSPACE}/members?where=\{"location":\{"$eq":"Asia"\}\}&page-size=20'     --header "x-cassandra-token: ${ASTRA_DB_APPLICATION_TOKEN}"

# Get RAW output (`raw=true`)
curl --request GET \
    --url https://${ASTRA_DB_ID}-${ASTRA_DB_REGION}.apps.astra.datastax.com/api/rest/v2/keyspaces/${ASTRA_DB_KEYSPACE}/members?where=\{"location":\{"$eq":"Asia"\}\}&page-size=10&raw=true'     --header "x-cassandra-token: ${ASTRA_DB_APPLICATION_TOKEN}"

# Move to page state (`page-state`): this will move to the next row according to the specified `page-size`
curl --request GET \
    --url https://${ASTRA_DB_ID}-${ASTRA_DB_REGION}.apps.astra.datastax.com/api/rest/v2/keyspaces/${ASTRA_DB_KEYSPACE}/members?where=\{"location":\{"$eq":"Asia"\}\}&page-size=1&page-state=EPlPm8sU2Eutr80K8r-nRSIA8H____0A'     --header "x-cassandra-token: ${ASTRA_DB_APPLICATION_TOKEN}"

# Sorting data (`sort={"name":"desc"}` need to have a CLUSTERING COLUMN to perform order)
curl --request GET \
    --url https://${ASTRA_DB_ID}-${ASTRA_DB_REGION}.apps.astra.datastax.com/api/rest/v2/keyspaces/${ASTRA_DB_KEYSPACE}/members?where=\{"location":\{"$eq":"Asia"\}\}&sort=\{"name":"desc"\}&page-size=10'     --header "x-cassandra-token: ${ASTRA_DB_APPLICATION_TOKEN}"
```

## Retrieve a row by ID
```bash
curl --request GET \
    --url https://${ASTRA_DB_ID}-${ASTRA_DB_REGION}.apps.astra.datastax.com/api/rest/v2/keyspaces/${ASTRA_DB_KEYSPACE}/members/5ea53e52-dd0c-49af-82c2-f3e210530e2f \
    --header "x-cassandra-token: ${ASTRA_DB_APPLICATION_TOKEN}"
# returns: {"count":1,"data":[{"name":"eight","github":"awesomecoder","location":"Asia","id":"5ea53e52-dd0c-49af-82c2-f3e210530e2f"}]}
```


```bash
curl --request PUT \
    --url https://${ASTRA_DB_ID}-${ASTRA_DB_REGION}.apps.astra.datastax.com/api/rest/v2/keyspaces/${ASTRA_DB_KEYSPACE}/members/5ea53e52-dd0c-49af-82c2-f3e210530e2f \
    --header "x-cassandra-token: ${ASTRA_DB_APPLICATION_TOKEN}" \
    --data '{
    "name":"eights"
    }'
# returns: {"data":{"name":"eights"}}
```

## Delete a row
```bash
curl --request DELETE \
    --url https://${ASTRA_DB_ID}-${ASTRA_DB_REGION}.apps.astra.datastax.com/api/rest/v2/keyspaces/${ASTRA_DB_KEYSPACE}/members/3210ed59-5cb4-486b-ba5a-158139213276 \
    --header 'content-type: application/json' \
    --header "x-cassandra-token: ${ASTRA_DB_APPLICATION_TOKEN}"
```

# API reference:
Document & REST API:
https://docs.datastax.com/en/astra/docs/_attachments/docv2.html
DevOps operations:
https://docs.datastax.com/en/astra/docs/_attachments/devopsv2.html
