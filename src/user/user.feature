Feature: User Management

  Scenario: Creating a new user
    Given I have a valid user data
    When I submit the data to the user API
    Then I should receive a confirmation with the user ID
