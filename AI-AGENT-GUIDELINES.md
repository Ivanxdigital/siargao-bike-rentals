# AI Agent Guidelines for Bike Rental App Development

## Core Development Principles

1. **Follow the Roadmap Sequence**
   - Implement features in the order specified in the development roadmap
   - Complete each section before moving to the next unless explicitly directed otherwise
   - Mark tasks as completed in the roadmap file as you progress

2. **Mobile-First Design**
   - Design all interfaces for mobile devices first
   - Ensure all screens are fully functional on small screens before enhancing for tablets
   - Maintain consistent touch targets (minimum 44×44 points)

3. **Performance Consciousness**
   - Minimize API calls and implement proper caching
   - Optimize image loading with appropriate sizing and progressive loading
   - Keep bundle size small by avoiding unnecessary dependencies

4. **Code Organization**
   - Follow a consistent folder structure (features, components, hooks, utils)
   - Implement atomic design for UI components
   - Keep files focused on single responsibilities

## Supabase Integration Rules

1. **Security First**
   - Implement Row Level Security (RLS) for all tables
   - Never expose API keys in client-side code
   - Use environment variables for all sensitive information
   - Follow the principle of least privilege for all roles

2. **Data Structure**
   - Design relationships with appropriate foreign keys
   - Implement proper indexing for frequently queried fields
   - Use PostgreSQL features (like triggers) when appropriate
   - Include created_at and updated_at timestamps for all tables

3. **Authentication**
   - Use Supabase auth for all user management
   - Implement proper session handling and token refresh
   - Securely handle role-based access control
   - Provide proper error messaging for auth issues

## User Experience Requirements

1. **Responsive Feedback**
   - Provide loading states for all async operations
   - Implement error handling with user-friendly messages
   - Use haptic feedback for important interactions
   - Design meaningful empty states for all list views

2. **Accessibility**
   - Maintain proper contrast ratios (minimum WCAG AA compliance)
   - Include proper text alternatives for all images
   - Ensure keyboard/screen reader navigation works
   - Support dynamic text sizes

3. **Interaction Design**
   - Keep primary actions within thumb reach
   - Maintain consistent interaction patterns
   - Implement proper form validation with clear feedback
   - Use animations purposefully and sparingly

## Project-Specific Rules

1. **Multi-Role Support**
   - Strictly enforce separation between regular users, rental shops, and admin roles
   - Build distinctive flows for each user type
   - Never show admin or shop owner controls to regular users
   - Implement role verification on both client and server

2. **Location Services**
   - Request location permissions only when needed
   - Provide fallbacks when location services are denied
   - Use location data only for intended purposes (finding nearby rentals)
   - Consider battery impact when implementing location features

3. **Review System Integrity**
   - Only allow reviews from users who completed a rental
   - Implement spam detection for review content
   - Create balanced rating calculations
   - Allow shop owners to respond to reviews

4. **Bike Management**
   - Design clear bike categorization system
   - Implement proper inventory tracking to prevent double bookings
   - Create detailed bike specification templates
   - Support photo management with proper optimization

## Quality Assurance

1. **Testing Requirements**
   - Write unit tests for all critical business logic
   - Implement integration tests for user flows
   - Test on multiple device sizes and operating system versions
   - Verify all third-party integrations with mock services

2. **Error Handling**
   - Implement global error boundary
   - Log errors with appropriate context
   - Provide recovery paths for common error scenarios
   - Never display technical errors to end users

3. **Documentation**
   - Document all API endpoints and expected responses
   - Create clear comments for complex logic
   - Maintain up-to-date environment setup instructions
   - Document user flows for each role

## Development Process

1. **Version Control**
   - Make atomic commits with clear messages
   - Create meaningful branch names
   - Don't commit sensitive information or large binary files
   - Keep the main branch always deployable

2. **Code Quality**
   - Follow consistent naming conventions
   - Avoid code duplication
   - Keep functions small and focused
   - Follow the project's established coding style

3. **Dependency Management**
   - Minimize third-party dependencies
   - Verify licenses before adding packages
   - Keep dependencies updated but stable
   - Consider package size impact on bundle 