Feature: User access token

  Background: Given a user is already registered
    Given I have a valid user data
    When I submit the data to the user API
    Then I should receive user from query "register" with status "201"
    And I have a token to verify the email
    When I submit the token to the auth API
    Then I should receive user from query "verifyEmailToken" with status "200"
    And I have valid login credentials
    When I submit the authenticate request to the auth API
    Then I should receive a success message

  @VerifyUserToken
  Scenario: User Access Token check after login
    Given I have valid access token
    When I submit the access token request to the auth API
    Then I should receive a success message with user data