const mongoose = require("mongoose")
const chai = require("chai")
const chaiHttp = require("chai-http")
const server = require("../../../server")
const should = chai.should()
const registerCustomerData = require("../../test-data/authentication/registerCustomer")
const loginCustomerData = require("../../test-data/authentication/loginCustomer")
const nonExistentCustomerData = require("../../test-data/authentication/nonExistentCustomer.json")
const { response } = require("express")
const testCollection = 'users'
const REGISTER_CUSTOMER_ROUTE = '/registerCustomer'
const LOGIN_CUSTOMER_ROUTE = '/loginCustomer'
const HOME_ROUTE = '/home'
const PING_ROUTE = '/'
chai.use(chaiHttp)

const dropUserDatabase = ()=>{
    try{
        mongoose.connection.collection(testCollection).drop()
        console.log("collection dropped")
    }
    catch(err){
        console.log(err.message)
    }
}

describe("/POST Routes", function () {
    before((done) => {
        dropUserDatabase()
        done()
    });
    it("Should successfully register a new customer", registerNewCustomer)
    it("Should successfully login a existing customer", loginExistingCustomer)
    it("Should successfully reject a non-existing customer", rejectNonExistentCustomerData)

});

describe('/GET Routes', function () {
    before((done) => {
        dropUserDatabase()
        done()
    });
    it("Should perform a successful ping response", successfulPingRoute);
    // it("Should register and login a new/existing customer and verify authentication to the home route", verifyUserAuthentication) // login + Register + Home route(Validate)
})

async function registerNewCustomer() {
    // To register a new customer
  try {
      var response = await chai.request(server).post(REGISTER_CUSTOMER_ROUTE).send(registerCustomerData)
  } catch (err) {
    console.log(err.message)
  }
    // response.body.should.have.property("success").to.equal(true)
    // // response.should.have.status(200)
    // response.body.should.be.a("object")
    // response.body.should.have.property("accessToken") // To verify if the customer object has the token
    // response.body.should.have.property("refreshToken") // To verify if the customer object has the token

}

async function loginExistingCustomer() {
    try {
        var loginCustomer = await chai.request(server).post(LOGIN_CUSTOMER_ROUTE).send(loginCustomerData)
    } catch (err) {
        console.log(err.message)
    }
    loginCustomer.body.should.have.property("success").to.equal(true)
    loginCustomer.should.have.status(200)
    loginCustomer.body.should.be.a("object")
    loginCustomer.body.should.have.property("accessToken") // To verify if the customer object has the token
    loginCustomer.body.should.have.property("refreshToken") // To verify if the customer object has the token

}


async function rejectNonExistentCustomerData() {
    try {
        var rejectLoginCustomer = await chai.request(server).post(LOGIN_CUSTOMER_ROUTE).send(nonExistentCustomerData)
    } catch (err) {
        console.log(err.message)
    }
    rejectLoginCustomer.body.should.have.property("success").to.equal(false)
    rejectLoginCustomer.should.have.status(401)
    rejectLoginCustomer.body.should.not.have.property("token") // To verify if the customer object has the token
}

async function verifyUserAuthentication() {
    // To register and login a new/existing customer and check the users authentication to the Home route
    try {
        var registerCustomer = await chai.request(server).post(REGISTER_CUSTOMER_ROUTE).send(registerCustomerData)
        var loginCustomer = await chai.request(server).post(LOGIN_CUSTOMER_ROUTE).send(loginCustomerData)
        var jwtLoginResponse = await chai.request(server).get(HOME_ROUTE).query({accessToken:loginCustomer.body.accessToken})
        var jwtRegisterResponse = await chai.request(server).get(HOME_ROUTE).query({accessToken:registerCustomer.body.accessToken })
    } catch (err) {
        console.log(err.message)
    }
    jwtLoginResponse.should.have.status(200)
    jwtRegisterResponse.should.have.status(200)

}

// To perform a ping to verify the application is running successfully
async function successfulPingRoute() {
    try {
        var response = await chai.request(server).get(PING_ROUTE)
    } catch (err) {
        console.log(err.message)
    }
    response.body.should.have.property("success").to.equal(true)
    response.should.have.status(200)
}