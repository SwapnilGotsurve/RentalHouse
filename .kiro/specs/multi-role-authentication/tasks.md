# Implementation Plan

- [ ] 1. Set up backend authentication infrastructure
  - Update User model to include role field and authentication methods
  - Create JWT utility functions for token generation and validation
  - Set up bcrypt for password hashing
  - _Requirements: 1.2, 5.1, 5.2_

- [ ]* 1.1 Write property test for role validation and storage
  - **Property 1: Role validation and storage**
  - **Validates: Requirements 1.2**

- [ ]* 1.2 Write property test for password security
  - **Property 10: Password security**
  - **Validates: Requirements 5.1**

- [ ] 2. Implement backend authentication routes
  - Create registration endpoint with role selection and validation
  - Create login endpoint with credential verification and JWT generation
  - Create logout endpoint with token invalidation
  - Create user profile endpoint for getting current user info
  - _Requirements: 1.1, 1.3, 1.4, 1.5, 2.2, 2.3, 4.1, 4.2_

- [ ]* 2.1 Write property test for valid registration
  - **Property 2: Valid registration creates account and redirects**
  - **Validates: Requirements 1.3**

- [ ]* 2.2 Write property test for invalid registration validation
  - **Property 3: Invalid registration data validation**
  - **Validates: Requirements 1.5**

- [ ]* 2.3 Write property test for valid login authentication
  - **Property 4: Valid login authentication and routing**
  - **Validates: Requirements 2.2**

- [ ]* 2.4 Write property test for invalid login handling
  - **Property 5: Invalid login credential handling**
  - **Validates: Requirements 2.3**

- [ ] 3. Create authentication middleware for protected routes
  - Implement JWT token validation middleware
  - Create role-based access control middleware
  - Add middleware to existing protected routes
  - _Requirements: 3.4, 3.5, 5.3, 5.5_

- [ ]* 3.1 Write property test for JWT token management
  - **Property 11: JWT token management**
  - **Validates: Requirements 5.2, 5.3**

- [ ]* 3.2 Write property test for unauthenticated access control
  - **Property 7: Unauthenticated access control**
  - **Validates: Requirements 3.4**

- [ ]* 3.3 Write property test for role-based access control
  - **Property 8: Role-based access control**
  - **Validates: Requirements 3.5**

- [ ] 4. Checkpoint - Ensure backend authentication is working
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 5. Set up frontend authentication context and state management
  - Create AuthContext for global authentication state
  - Implement AuthProvider with login, register, logout methods
  - Add token storage and retrieval from localStorage
  - _Requirements: 2.4, 2.5, 4.3, 4.4_

- [ ]* 5.1 Write property test for session state persistence
  - **Property 6: Session state persistence**
  - **Validates: Requirements 2.4, 2.5**

- [ ]* 5.2 Write property test for logout state cleanup
  - **Property 9: Logout state cleanup**
  - **Validates: Requirements 4.1, 4.2, 4.3, 4.4**

- [ ] 6. Create authentication pages and forms
  - Build Login component with email/password form
  - Build Register component with email/password/role selection form
  - Add form validation and error handling
  - Implement navigation between login and register pages
  - _Requirements: 1.1, 2.1, 1.5, 2.3_

- [ ] 7. Implement protected route components
  - Create ProtectedRoute wrapper for authentication checks
  - Create RoleBasedRoute wrapper for role-specific access
  - Add automatic redirects for unauthorized access
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ]* 7.1 Write property test for role-based authorization
  - **Property 12: Role-based authorization**
  - **Validates: Requirements 5.5**

- [ ] 8. Update App.jsx routing for authentication flow
  - Add routes for login and register pages
  - Wrap existing panel routes with appropriate protection
  - Implement role-based dashboard redirects after login
  - _Requirements: 1.3, 2.2, 3.1, 3.2, 3.3_

- [ ] 9. Connect frontend authentication with backend APIs
  - Implement API calls for login, register, and logout
  - Add JWT token to API request headers
  - Handle authentication errors and token expiration
  - _Requirements: 1.3, 1.4, 2.2, 2.3, 4.1, 5.4_

- [ ] 10. Add authentication UI to existing layouts
  - Add login/logout buttons to navigation components
  - Update TenantPanelLayout, OwnerPanelLayout, AdminPanelLayout with auth controls
  - Display current user information in panel headers
  - _Requirements: 4.1, 2.4_

- [ ] 11. Final checkpoint - Complete authentication system testing
  - Ensure all tests pass, ask the user if questions arise.
  - Test complete user flows: registration → login → dashboard access → logout