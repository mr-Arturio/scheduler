describe("Appointments", () => {

  beforeEach(() => {
    cy.request("GET", "/api/debug/reset");
    // 1. Visits the root of our web server
    cy.visit("/");
  
    cy.contains("Monday");
   });

  it('should book an interview', () => {
       // 2. Clicks on the "Add" button in the second appointment
    cy.get("[alt=Add]")
    .first()
    .click();

    // 3. Enters their name
    cy.get("[data-testid=student-name-input]")
    .type("Lydia Miller-Jones");

    // 4. Chooses an interviewer
    cy.get("[alt='Sylvia Palmer']")
    .click();

    // 5. Clicks the save button
    cy.contains("Save")
    .click();

    // 6. Sees the booked appointment
    cy.get(".appointment__card--show").should("contain", "Sylvia Palmer");
cy.contains(".appointment__card--show", "Lydia Miller-Jones");
  })

  it("should edit an interview", () => {

    //2. Clicks the edit button for the existing appointment
    cy.get("[alt=Edit]")
    .first()
    .click({ force: true });

    //3. Changes the name and interviewer
    cy.get("[data-testid=student-name-input]")
    .clear()
    .type("Artur");
    cy.get("[alt='Tori Malcolm']")
    .click();

    //4. Clicks the save button
    cy.contains("Save")
    .click();

    //5. Sees the edit to the appointment
    cy.get(".appointment__card--show").should("contain", "Artur");
cy.contains(".appointment__card--show", "Tori Malcolm");
  })
  
    
 
});