Feature: User Login Success

  Background: Given a user is already registered
    Given I have a valid user data
    When I submit the data to the user API
    Then I should receive user from query "register" with status "201"

  @UserEmailVerification
  Scenario: Verify email with token and update user isVerified field
    Given I have a token to verify the email
    When I submit the token to the auth API
    Then I should receive user from query "verifyEmailToken" with status "200"

  @UserLogin
  Scenario: Login with valid credentials after verifying email
    Given I have valid login credentials
    And I have a token to verify the email
    When I submit the token to the auth API
    Then I should receive user from query "verifyEmailToken" with status "200"
    When I submit the authenticate request to the auth API
    Then I should receive a success message
