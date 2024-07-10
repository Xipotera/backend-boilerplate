Feature: User Login Success

  Background: Given a user is already registered
    Given I have a valid user data
    When I submit the data to the user API
    Then I should receive a confirmation with the user ID

  Scenario: Verify email with token and update user isVerified field
    Given I have a token to verify the email
    When I submit the token to the auth API
    Then I should receive a confirmation with the user ID

  Scenario: Login with valid credentials
    Given I have valid login credentials
    When I submit the authenticate request to the auth API
    Then I should receive an success message

