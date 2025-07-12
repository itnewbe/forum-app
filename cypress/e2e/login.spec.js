/* eslint-env cypress */
/// <reference types="cypress" />

describe("Login Flow", () => {
  it("should login successfully", () => {
    cy.visit("http://localhost:3000/login");
    cy.get('input[placeholder="Enter your email"]').type("bella@gmail.com");
    cy.get('input[placeholder="Enter your password"]').type("123456");
    cy.get("button").contains("Login").click();
    cy.url().should("eq", "http://localhost:3000/");
    cy.contains("Logout").should("exist");
  });
});
