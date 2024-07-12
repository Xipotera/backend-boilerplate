Feature: User Registration

@RegisterUser
  Scenario: Register user
    Given I have a valid user data
    When I submit the data to the user API
    Then I should receive user from query "register" with status "201"