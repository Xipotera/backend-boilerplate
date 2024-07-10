Feature: Environment Variable

  Scenario: Retrieve NODE_ENV from the backend
    Given the backend is running
    When I request the NODE_ENV
    Then I should receive the NODE_ENV value
