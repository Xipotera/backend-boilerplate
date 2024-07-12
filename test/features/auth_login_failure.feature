Feature: User Login Failure

  Background: Given a user is already registered
    Given I have a valid user data
    When I submit the data to the user API
    Then I should receive user from query "register" with status "201"

  Scenario: Login with valid credentials but user email is not verified
    Given I have valid login credentials
    When I submit the authenticate request to the auth API
    Then I should receive an error message with the reason "check-inbox-to-validate-email"

  Scenario: Login with invalid credentials
    Given I have invalid login credentials
    When I submit the authenticate request to the auth API
    Then I should receive an error message with the reason "invalid-credentials"

