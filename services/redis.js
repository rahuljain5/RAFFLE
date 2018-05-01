"use strict";
var redis = require("redis");
const client = redis.createClient(redisURL);

const set = function(key, value) {
  return client.set(key, value, redis.print);
}
const setex = function(key,value,ttl){
return client.set(key, value,'EX',ttl);
}
const get = function(key, cb) {
  client.get(key, cb);
}


exports.redis = client;
exports.set = set;
exports.setex = setex;
exports.get = get;

