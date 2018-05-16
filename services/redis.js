"use strict";
const env = process.env.NODE_ENV || "development";
const redisURL = require("../config/config")[env].redis_url;
var redis = require("redis");
const client = redis.createClient(redisURL);

const set = function(key, value) {
  return client.set(key, value, redis.print);
}
const setex = function(key,value,ttl){
return client.set(key, value,'EX',ttl);
}
const get = function(key,callback) {
 client.get(key,callback);
  
}
const del = function (key,callback){
  client.del(key,callback)
}




exports.set = set;
exports.setex = setex;
exports.get = get;
exports.del = del;

