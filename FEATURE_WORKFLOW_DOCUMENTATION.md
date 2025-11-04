# CMS Feature Workflow Documentation

## Table of Contents

1. [Content Builder](#content-builder)
2. [Content Management](#content-management)
3. [Content Relations](#content-relations)
4. [Assets Media](#assets-media)
5. [Workflow Management](#workflow-management)
6. [Approval Queue](#approval-queue)
7. [User Management](#user-management)
8. [Role & Permissions](#role--permissions)

---

## Content Builder

### Overview
Content Builder is the foundation of the CMS, allowing administrators to define content types (schemas) and their fields. It serves as the blueprint for creating content entries in the Content Management module.

### Workflow: Create Content Type

#### Step-by-Step Process

1. **Navigate to Content Builder**
   - User clicks "Content Builder" in sidebar
   - Page displays: `/content-builder`

2. **Initiate Creation**
   - User clicks "Create New Content Type" button
   - Navigates to: `/content-builder/create`

3. **Fill Content Type Form**
   - **Name Field**: Enter display name (e.g., "Article", "Product")
   - **API Slug Field**: Auto-generated from name, can be edited
     - Format: lowercase, hyphens for spaces (e.g., "blog-article")
   - **SEO Enabled Toggle**: Enable/disable SEO fields
   - **Submit**: Click "Create Content Type"

4. **Backend Process**
   - **API Call**: `POST /content/types`
   - **Validation**: Checks name uniqueness, slug format
   - **Database**: Creates `ContentType` record
   - **Response**: Returns created ContentType with ID

5. **Redirect**
   - User redirected to: `/content-builder/{id}`
   - Shows Content Type detail page with Overview tab

### Workflow: Add Field to Content Type

#### Step-by-Step Process

1. **Access Content Type Detail**
   - Navigate to Content Type detail page: `/content-builder/{id}`
   - Click "Fields" tab or "Add Field" quick action

2. **Navigate to Field Creation**
   - Click "Add New Field" button in Fields tab
   - OR click "Add Field" card in Quick Actions
   - Navigates to: `/content-builder/{id}/fields/create`

3. **Fill Field Form**
   - **Field Name**: Enter field identifier (e.g., "title", "description")
   - **Field Type**: Select from dropdown:
     - `text` - Single line text
     - `textarea` - Multi-line text
     - `number` - Numeric value
     - `boolean` - True/false
     - `date` - Date picker
     - `datetime` - Date and time
     - `select` - Dropdown selection
     - `multiselect` - Multiple selections
     - `media` - Media file picker
     - `relation` - Link to other content
     - `json` - JSON data
   - **Required**: Toggle to make field mandatory
   - **Unique**: Toggle to enforce uniqueness
   - **SEO Field**: Toggle to mark as SEO field
   - **Placeholder**: Optional placeholder text
   - **Help Text**: Optional description
   - **Validation Rules**:
     - Min Length, Max Length (for text fields)
     - Min Value, Max Value (for number fields)
     - Pattern (regex pattern for validation)
     - Default Value

4. **Field Type-Specific Behavior**
   - **Media Field**: Opens media library picker when clicked
   - **Relation Field**: Opens content selector to link entries
   - **Select/Multiselect**: Displays options input

5. **Backend Process**
   - **API Call**: `POST /content/types/{content_type_id}/fields`
   - **Validation**: Validates field name uniqueness within content type
   - **Database**: Creates `ContentField` record
   - **Response**: Returns created ContentField

6. **Redirect**
   - User redirected back to: `/content-builder/{id}?tab=fields`
   - Field appears in Fields list

### Workflow: Edit Content Type

#### Step-by-Step Process

1. **Access Edit Page**
   - From Content Type detail page
   - Click "Edit" button (orange)
   - Navigates to: `/content-builder/{id}/edit`

2. **Modify Content Type**
   - Edit Name, Slug, or SEO toggle
   - Click "Save Changes"

3. **Backend Process**
   - **API Call**: `PUT /content/types/{id}`
   - **Validation**: Checks name uniqueness, slug format
   - **Database**: Updates `ContentType` record
   - **Response**: Returns updated ContentType

4. **Redirect**
   - User redirected to: `/content-builder/{id}`
   - Shows updated information

### Workflow: Edit Field

#### Step-by-Step Process

1. **Access Field Edit**
   - From Fields tab in Content Type detail
   - Click pencil icon on field card
   - Opens Field Form modal with existing data

2. **Modify Field**
   - Edit any field properties
   - Note: Field type change may require data migration
   - Click "Save Field"

3. **Backend Process**
   - **API Call**: `PUT /content/fields/{field_id}`
   - **Validation**: Validates field name uniqueness
   - **Database**: Updates `ContentField` record
   - **Response**: Returns updated ContentField

4. **Update UI**
   - Field card updates with new information
   - Modal closes

### Workflow: Delete Field

#### Step-by-Step Process

1. **Initiate Deletion**
   - From Fields tab
   - Click trash icon on field card
   - Confirmation dialog appears

2. **Confirm Deletion**
   - User confirms deletion
   - System checks if field has data in entries

3. **Backend Process**
   - **API Call**: `DELETE /content/fields/{field_id}`
   - **Validation**: Checks if field is used in entries
   - **Database**: Soft deletes `ContentField` record
   - **Response**: Returns success status

4. **Update UI**
   - Field removed from list
   - If field had data, system may prompt for data handling

### Workflow: View Field Validation Rules

#### Step-by-Step Process

1. **Access Validation Page**
   - From Fields tab
   - Click "View Validation Rules" icon (FileText)
   - Navigates to: `/content-builder/{id}/fields/{field_id}/validation`

2. **View Validation Rules**
   - Page displays table of all validation rules:
     - Field Name
     - Field Type
     - Required status
     - Unique status
     - Min/Max Length
     - Pattern
     - Min/Max Value
     - Default Value
     - Placeholder
     - Help Text

3. **Backend Process**
   - **API Call**: `GET /content/fields/{field_id}/validation`
   - **Response**: Returns ValidationRules object

4. **Actions Available**
   - Click "Edit Field" to modify validation rules

### Workflow: View API Reference

#### Step-by-Step Process

1. **Access API Reference**
   - From Content Type detail page
   - Click "API Reference" card in Quick Actions
   - Navigates to: `/content-builder/{id}/api-reference`

2. **View API Documentation**
   - **API Info Card**: Shows Content Type name, slug, base URL
   - **Fields Table**: Lists all fields with types and validation
   - **Endpoints Section**: Displays REST API endpoints:
     - `GET /content/{slug}/entries` - List entries
     - `GET /content/{slug}/entries/{id}` - Get entry
     - `POST /content/{slug}/entries` - Create entry
     - `PUT /content/{slug}/entries/{id}` - Update entry
     - `DELETE /content/{slug}/entries/{id}` - Delete entry
   - **Request/Response Examples**: JSON examples for each endpoint
   - **Copy to Clipboard**: Click to copy code examples

3. **Download Options**
   - **Download OpenAPI Spec**: Downloads YAML file
   - **Download Markdown Docs**: Downloads Markdown documentation

4. **Backend Process**
   - **API Call**: `GET /content/types/{id}/api-reference`
   - **Response**: Returns APIReference object with endpoints and examples

### Workflow: Delete Content Type

#### Step-by-Step Process

1. **Initiate Deletion**
   - From Content Type list page
   - Click trash icon on content type row
   - Confirmation dialog appears

2. **Confirm Deletion**
   - System checks if content type has entries
   - If entries exist, warns user
   - User confirms deletion

3. **Backend Process**
   - **API Call**: `DELETE /content/types/{id}`
   - **Validation**: Checks for existing entries
   - **Database**: Soft deletes `ContentType` and related fields
   - **Response**: Returns success status

4. **Update UI**
   - Content type removed from list
   - User redirected to Content Builder list page

---

## Content Management

### Overview
Content Management allows users to create, edit, view, and manage content entries based on Content Types defined in Content Builder. It handles the actual content data, not the schema.

### Workflow: Create Content Entry

#### Step-by-Step Process

1. **Navigate to Content Management**
   - User clicks "Content Management" in sidebar
   - Page displays: `/content-management`
   - Shows grid of Content Type cards

2. **Select Content Type**
   - User clicks on a Content Type card (e.g., "Article", "Product")
   - Navigates to: `/content-management/{content_type_id}`
   - Shows list of existing entries for that type

3. **Initiate Creation**
   - User clicks "Create New Entry" button
   - Navigates to: `/content-management/{content_type_id}/create`

4. **Fill Entry Form**
   - Form dynamically generated based on Content Type fields
   - **Regular Fields**: All non-SEO fields displayed
   - **SEO Fields** (if enabled): Meta title, description, image, slug
   - **Field Validation**: Real-time validation based on field rules
   - **Media Fields**: Opens media picker when clicked
   - **Relation Fields**: Opens content selector

5. **Form Behavior**
   - **Required Fields**: Marked with asterisk, validated on submit
   - **Field Types**: Render appropriate input (text, textarea, select, etc.)
   - **Default Values**: Pre-filled if defined in field configuration
   - **Help Text**: Displayed below fields

6. **Submit Entry**
   - User clicks "Create Entry"
   - Client-side validation runs
   - If valid, form submits

7. **Backend Process**
   - **API Call**: `POST /content/{content_type_id}/entries`
   - **Request Body**: JSON with field values
   - **Validation**: Server validates all field rules
   - **Status Assignment**: Entry created with status "draft"
   - **Database**: Creates `ContentEntry` record
   - **Response**: Returns created ContentEntry with ID

8. **Redirect**
   - User redirected to: `/content-management/{content_type_id}/entries/{entry_id}`
   - Shows entry detail page

### Workflow: Edit Content Entry

#### Step-by-Step Process

1. **Access Entry Detail**
   - From entry list or search results
   - Click on entry row or title
   - Navigates to: `/content-management/{content_type_id}/entries/{entry_id}`

2. **Initiate Edit**
   - Click "Edit Content" button (orange)
   - Page switches to edit mode
   - Form pre-filled with existing data

3. **Modify Entry**
   - Edit any field values
   - **Status Preservation**: Status remains unchanged (workflow managed separately)
   - **Validation**: Real-time validation applies

4. **Save Changes**
   - Click "Save Changes"
   - Client-side validation runs

5. **Backend Process**
   - **API Call**: `PUT /content/entries/{entry_id}`
   - **Request Body**: JSON with updated field values
   - **Validation**: Server validates field rules
   - **Status**: Existing status preserved
   - **Updated By**: System tracks updater user ID
   - **Database**: Updates `ContentEntry` record
   - **Response**: Returns updated ContentEntry

6. **Update UI**
   - Page switches back to view mode
   - Updated data displayed
   - Success message shown

### Workflow: View Entry Details

#### Step-by-Step Process

1. **Access Entry Detail**
   - Navigate to: `/content-management/{content_type_id}/entries/{entry_id}`

2. **View Entry Information**
   - **Header Section**: Entry title, status badge, created/updated dates
   - **Content Data**: All field values displayed
   - **Metadata**: Creator, updater, published date (if published)
   - **Actions**: Edit, SEO Preview, Manage Workflow buttons

3. **Related Entries Section**
   - Displays related entries based on relations
   - Shows cards with entry titles, status, creation date
   - Click "View" to navigate to related entry

4. **Backend Process**
   - **API Call**: `GET /content/entries/{entry_id}`
   - **Response**: Returns ContentEntry with full data

### Workflow: Delete Entry

#### Step-by-Step Process

1. **Initiate Deletion**
   - From entry list page
   - Click trash icon on entry row
   - Confirmation dialog appears

2. **Confirm Deletion**
   - User confirms deletion
   - System checks if entry has relations

3. **Backend Process**
   - **API Call**: `DELETE /content/entries/{entry_id}`
   - **Validation**: Checks for existing relations
   - **Database**: Soft deletes `ContentEntry` record
   - **Response**: Returns success status

4. **Update UI**
   - Entry removed from list
   - User remains on entry list page

### Workflow: SEO Preview

#### Step-by-Step Process

1. **Access SEO Preview**
   - From entry detail page
   - Click "SEO Preview" button (teal)
   - Opens SEO Preview modal

2. **View SEO Previews**
   - **Tabs Available**:
     - **Google**: Search result preview
     - **Facebook**: Open Graph preview
     - **Twitter**: Twitter Card preview
     - **LinkedIn**: LinkedIn preview
     - **Metadata**: Raw metadata tags

3. **SEO Data Displayed**
   - **Title**: Meta title or entry title
   - **Description**: Meta description or excerpt
   - **Image**: Meta image or featured image
   - **URL**: Canonical URL
   - **Card Type**: Twitter card type (if applicable)

4. **Backend Process**
   - **API Call**: `GET /content/entries/{entry_id}/seo-preview`
   - **Response**: Returns SEO preview data

5. **Actions Available**
   - Click "Edit SEO Fields" to modify SEO data
   - Close modal to return to entry detail

### Workflow: Filter and Search Entries

#### Step-by-Step Process

1. **Access Entry List**
   - Navigate to: `/content-management/{content_type_id}`

2. **Search Entries**
   - Enter search query in search bar
   - Searches across title, description, and content fields
   - Results update in real-time

3. **Filter by Status**
   - Select status from dropdown
   - Options: All, Draft, In Review, Ready for Approval, Approved, Published, Rejected
   - Results filtered immediately

4. **Filter by Creator**
   - Select creator from dropdown
   - Shows entries created by selected user

5. **Backend Process**
   - **API Call**: `GET /content/{content_type_id}/entries?status={status}&created_by={user_id}&search={query}`
   - **Response**: Returns filtered list of entries

---

## Content Relations

### Overview
Content Relations allows users to create and manage relationships between content entries. It supports various relation types: belongs_to, has_many, has_one, many_to_many, and related.

### Workflow: Create Content Relation

#### Step-by-Step Process

1. **Navigate to Content Relations**
   - User clicks "Content Relations" in sidebar
   - Page displays: `/content-relations`
   - Shows list of existing relations

2. **Initiate Creation**
   - User clicks "Create Relation" button
   - Opens "Create New Relation" modal

3. **Fill Relation Form**
   - **From Entry**: Select source entry (dropdown or search)
   - **Relation Type**: Select from dropdown:
     - `belongs_to` - Entry belongs to another entry
     - `has_many` - Entry has many related entries
     - `has_one` - Entry has one related entry
     - `many_to_many` - Many-to-many relationship
     - `related` - General related entries
   - **To Entry**: Select target entry (dropdown or search)
   - **Submit**: Click "Create Relation"

4. **Backend Process**
   - **API Call**: `POST /content/{from_content_id}/relations`
   - **Request Body**: `{ to_content_id, relation_type }`
   - **Validation**: Checks if entries exist, validates relation type
   - **Database**: Creates `ContentRelation` record
   - **Response**: Returns created ContentRelation

5. **Update UI**
   - Modal closes
   - New relation appears in relations table
   - Success message shown

### Workflow: View Entry Relations

#### Step-by-Step Process

1. **Access Entry Relations**
   - From Content Relations page
   - Click eye icon on relation row
   - Navigates to: `/content-relations/{entry_id}`

2. **View Relations**
   - Page displays all relations for selected entry
   - **Outgoing Relations**: Relations where entry is "from"
   - **Incoming Relations**: Relations where entry is "to"
   - Shows relation type, related entry title, status

3. **Backend Process**
   - **API Call**: `GET /content/{entry_id}/relations`
   - **Response**: Returns list of ContentRelation objects

### Workflow: Delete Relation

#### Step-by-Step Process

1. **Initiate Deletion**
   - From Content Relations page
   - Click trash icon on relation row
   - Confirmation dialog appears

2. **Confirm Deletion**
   - User confirms deletion

3. **Backend Process**
   - **API Call**: `DELETE /content/relations/{relation_id}`
   - **Database**: Deletes `ContentRelation` record
   - **Response**: Returns success status

4. **Update UI**
   - Relation removed from table
   - Success message shown

### Workflow: Filter Relations

#### Step-by-Step Process

1. **Search Relations**
   - Enter search query in search bar
   - Searches entry titles in relations
   - Results update in real-time

2. **Filter by Relation Type**
   - Select relation type from dropdown
   - Options: All Types, Belongs To, Has Many, Has One, Many to Many, Related
   - Results filtered immediately

3. **Filter by Content Type**
   - Select content type from dropdown
   - Shows relations involving selected content type

4. **Backend Process**
   - **API Call**: `GET /content/{entry_id}/relations?type={relation_type}&content_type={id}`
   - **Response**: Returns filtered list of relations

---

## Assets Media

### Overview
Media Library manages all media assets (images, videos, documents, etc.) used throughout the CMS. It provides organization through folders, search, and filtering capabilities.

### Workflow: Upload Media

#### Step-by-Step Process

1. **Navigate to Media Library**
   - User clicks "Media Library" in sidebar
   - Page displays: `/assets`
   - Shows grid/list of media files

2. **Initiate Upload**
   - User clicks "Upload Media" button
   - Navigates to: `/assets/upload`

3. **Select Files**
   - **Single Upload**: Click to select file(s)
   - **Bulk Upload**: Select multiple files
   - **Drag & Drop**: Drag files into upload area
   - **File Types Supported**: Images, videos, documents, PDFs

4. **Configure Upload**
   - **Folder**: Select destination folder (optional)
   - **Alt Text**: Enter alt text for accessibility
   - **Caption**: Enter caption/description
   - **Click Upload**: Starts upload process

5. **Upload Progress**
   - Progress bar shows upload status
   - Multiple files upload sequentially or in parallel

6. **Backend Process**
   - **API Call**: `POST /media/upload` (single) or `POST /media/bulk-upload` (multiple)
   - **Request**: Multipart form data with files
   - **File Processing**:
     - Validates file type and size
     - Generates thumbnails (for images)
     - Stores file in storage system
     - Creates database record
   - **Database**: Creates `MediaFile` record
   - **Response**: Returns created MediaFile(s)

7. **Redirect**
   - User redirected to: `/assets`
   - Uploaded files appear in media library
   - Success message shown

### Workflow: Create Folder

#### Step-by-Step Process

1. **Initiate Folder Creation**
   - From Media Library page
   - Click "Create Folder" button
   - OR right-click in folder tree and select "New Folder"
   - Opens "Create Folder" modal

2. **Fill Folder Form**
   - **Folder Name**: Enter folder name
   - **Parent Folder**: Select parent folder (optional, for nested folders)
   - **Submit**: Click "Create Folder"

3. **Backend Process**
   - **API Call**: `POST /media/folders`
   - **Request Body**: `{ name, parent_id }`
   - **Validation**: Checks name uniqueness within parent
   - **Database**: Creates `MediaFolder` record
   - **Response**: Returns created MediaFolder

4. **Update UI**
   - Modal closes
   - New folder appears in folder tree
   - Success message shown

### Workflow: Organize Media into Folders

#### Step-by-Step Process

1. **Select Media Files**
   - From grid or list view
   - Select one or multiple files

2. **Move to Folder**
   - Right-click selected files
   - OR use move action button
   - Select destination folder from dropdown
   - Confirm move

3. **Backend Process**
   - **API Call**: `PUT /media/{id}` for each file
   - **Request Body**: `{ folder_id }`
   - **Database**: Updates `MediaFile` records
   - **Response**: Returns updated MediaFile

4. **Update UI**
   - Files moved to selected folder
   - Folder view updates
   - Success message shown

### Workflow: Edit Media Metadata

#### Step-by-Step Process

1. **Access Media Detail**
   - From Media Library
   - Click on media file
   - Navigates to: `/assets/{id}`

2. **Initiate Edit**
   - Click "Edit" button
   - Navigates to: `/assets/{id}/edit`

3. **Modify Metadata**
   - **File Name**: Edit display name
   - **Alt Text**: Edit alt text
   - **Caption**: Edit caption/description
   - **Folder**: Change folder location
   - **Tags**: Add/remove tags

4. **Save Changes**
   - Click "Save Changes"

5. **Backend Process**
   - **API Call**: `PUT /media/{id}`
   - **Request Body**: JSON with updated metadata
   - **Database**: Updates `MediaFile` record
   - **Response**: Returns updated MediaFile

6. **Redirect**
   - User redirected to: `/assets/{id}`
   - Updated metadata displayed

### Workflow: Delete Media

#### Step-by-Step Process

1. **Initiate Deletion**
   - From Media Library or detail page
   - Click trash icon
   - Confirmation dialog appears

2. **Confirm Deletion**
   - User confirms deletion
   - System checks if media is used in entries

3. **Backend Process**
   - **API Call**: `DELETE /media/{id}`
   - **Validation**: Checks for references in entries
   - **File Deletion**: Removes file from storage
   - **Thumbnail Deletion**: Removes generated thumbnails
   - **Database**: Soft deletes `MediaFile` record
   - **Response**: Returns success status

4. **Update UI**
   - Media removed from library
   - If used in entries, system may warn user

### Workflow: Search and Filter Media

#### Step-by-Step Process

1. **Search Media**
   - Enter search query in search bar
   - Searches file name, alt text, caption
   - Results update in real-time

2. **Filter by Type**
   - Select media type from dropdown:
     - All Types
     - Images
     - Videos
     - Documents
     - Audio
   - Results filtered immediately

3. **Filter by Folder**
   - Click folder in folder tree
   - Shows only media in selected folder
   - Click "All" to show all media

4. **Toggle View Mode**
   - Grid View: Thumbnail grid layout
   - List View: Table with details

5. **Backend Process**
   - **API Call**: `GET /media/search?query={query}&type={type}&folder={folder_id}`
   - **Response**: Returns filtered list of media files

---

## Workflow Management

### Overview
Workflow Management handles the content approval process, allowing users to change content status, request reviews, approve/reject entries, and publish content. It enforces role-based transitions and maintains a complete audit trail.

### Workflow Status States

The system uses the following status flow:
1. **draft** → Initial state for new entries
2. **in_review** → Entry submitted for review
3. **ready_for_approval** → Entry ready for manager approval
4. **approved** → Entry approved by manager
5. **published** → Entry published and live
6. **rejected** → Entry rejected, can return to draft

### Workflow: Request Review

#### Step-by-Step Process

1. **Access Workflow Management**
   - From entry detail page
   - Click "Manage Workflow" button
   - Navigates to: `/workflow-management/{entry_id}`

2. **View Current Status**
   - Page displays entry details
   - Current status badge shown
   - Available actions based on status and user role

3. **Request Review**
   - If status is "draft"
   - Click "Request Review" button
   - Optional: Add comment explaining changes
   - Click "Submit"

4. **Backend Process**
   - **API Call**: `POST /workflow/entries/{entry_id}/request-review`
   - **Request Body**: `{ comment }`
   - **Validation**: 
     - Checks user role (editor, admin)
     - Validates transition from "draft" to "in_review"
   - **Status Change**: Updates entry status to "in_review"
   - **History**: Creates `WorkflowHistory` record
   - **Database**: Updates `ContentEntry` and creates `WorkflowHistory`
   - **Response**: Returns updated entry and history record

5. **Update UI**
   - Status badge updates to "In Review"
   - Workflow history updated
   - Success message shown

### Workflow: Approve Entry

#### Step-by-Step Process

1. **Access Entry**
   - From Workflow Management or Approval Queue
   - Navigate to entry detail: `/workflow-management/{entry_id}`

2. **Review Entry**
   - User reviews entry content
   - Checks workflow history and comments

3. **Approve Entry**
   - If status is "ready_for_approval"
   - Click "Approve" button (green)
   - Optional: Add approval comment
   - Click "Confirm Approval"

4. **Backend Process**
   - **API Call**: `POST /workflow/entries/{entry_id}/approve`
   - **Request Body**: `{ comment }`
   - **Validation**: 
     - Checks user role (manager, admin)
     - Validates transition from "ready_for_approval" to "approved"
   - **Status Change**: Updates entry status to "approved"
   - **History**: Creates `WorkflowHistory` record
   - **Database**: Updates `ContentEntry` and creates `WorkflowHistory`
   - **Response**: Returns updated entry

5. **Update UI**
   - Status badge updates to "Approved"
   - Workflow history updated
   - Success message shown

### Workflow: Reject Entry

#### Step-by-Step Process

1. **Access Entry**
   - From Workflow Management or Approval Queue
   - Navigate to entry detail

2. **Review Entry**
   - User reviews entry content
   - Identifies issues or required changes

3. **Reject Entry**
   - Click "Reject" button (red)
   - **Required**: Add rejection comment explaining reason
   - Click "Confirm Rejection"

4. **Backend Process**
   - **API Call**: `POST /workflow/entries/{entry_id}/reject`
   - **Request Body**: `{ comment }` (required)
   - **Validation**: 
     - Checks user role (manager, admin)
     - Validates transition from "ready_for_approval" to "rejected"
   - **Status Change**: Updates entry status to "rejected"
   - **History**: Creates `WorkflowHistory` record with rejection reason
   - **Database**: Updates `ContentEntry` and creates `WorkflowHistory`
   - **Response**: Returns updated entry

5. **Update UI**
   - Status badge updates to "Rejected"
   - Workflow history updated with rejection comment
   - Success message shown

### Workflow: Publish Entry

#### Step-by-Step Process

1. **Access Entry**
   - From Workflow Management
   - Navigate to entry detail

2. **Review Entry**
   - User reviews approved entry
   - Verifies content is ready for publication

3. **Publish Entry**
   - If status is "approved"
   - Click "Publish" button (green)
   - Optional: Add publication comment
   - Click "Confirm Publish"

4. **Backend Process**
   - **API Call**: `POST /workflow/entries/{entry_id}/publish`
   - **Request Body**: `{ comment }`
   - **Validation**: 
     - Checks user role (manager, admin)
     - Validates transition from "approved" to "published"
   - **Status Change**: Updates entry status to "published"
   - **Published Date**: Sets `publishedAt` timestamp
   - **History**: Creates `WorkflowHistory` record
   - **Database**: Updates `ContentEntry` and creates `WorkflowHistory`
   - **Response**: Returns updated entry

5. **Update UI**
   - Status badge updates to "Published"
   - Published date displayed
   - Workflow history updated
   - Success message shown

### Workflow: Change Status Manually

#### Step-by-Step Process

1. **Access Entry**
   - From Workflow Management
   - Navigate to entry detail

2. **View Available Transitions**
   - System shows available status transitions based on:
     - Current status
     - User role
     - Workflow transition rules

3. **Select New Status**
   - Click dropdown or status button
   - Select target status
   - Add optional comment

4. **Submit Status Change**
   - Click "Change Status"
   - System validates transition

5. **Backend Process**
   - **API Call**: `POST /workflow/entries/{entry_id}/status`
   - **Request Body**: `{ status, comment }`
   - **Validation**: 
     - Checks user role
     - Validates transition rules
     - Ensures transition is allowed
   - **Status Change**: Updates entry status
   - **History**: Creates `WorkflowHistory` record
   - **Database**: Updates `ContentEntry` and creates `WorkflowHistory`
   - **Response**: Returns updated entry

6. **Update UI**
   - Status badge updates
   - Workflow history updated
   - Success message shown

### Workflow: Add Comment

#### Step-by-Step Process

1. **Access Entry**
   - From Workflow Management
   - Navigate to entry detail

2. **View Comments Section**
   - Scroll to comments section
   - View existing comments

3. **Add Comment**
   - Enter comment in text area
   - **Private Comment**: Toggle to make comment private (only visible to author and admins)
   - Click "Add Comment"

4. **Backend Process**
   - **API Call**: `POST /workflow/entries/{entry_id}/comments`
   - **Request Body**: `{ comment, is_private }`
   - **Database**: Creates `WorkflowComment` record
   - **Response**: Returns created comment

5. **Update UI**
   - Comment appears in comments list
   - Shows author, timestamp, privacy indicator

### Workflow: View History

#### Step-by-Step Process

1. **Access History**
   - From Workflow Management entry detail
   - Click "History" tab
   - OR navigate to: `/workflow-management/{entry_id}/history`

2. **View Workflow History**
   - Timeline of all status changes
   - Shows: From status → To status
   - Displays: User, timestamp, comment
   - Chronological order (newest first)

3. **Backend Process**
   - **API Call**: `GET /workflow/entries/{entry_id}/history`
   - **Response**: Returns list of `WorkflowHistory` records

### Workflow: Assign Entry

#### Step-by-Step Process

1. **Access Entry**
   - From Workflow Management
   - Navigate to entry detail

2. **Assign to User**
   - Click "Assign" button
   - Select user from dropdown
   - Add optional comment
   - Click "Assign"

3. **Backend Process**
   - **API Call**: `POST /workflow/entries/{entry_id}/assign`
   - **Request Body**: `{ user_id, comment }`
   - **Database**: Creates assignment record
   - **Response**: Returns assignment details

4. **Update UI**
   - Assignment displayed in entry detail
   - Assigned user notified (if notifications enabled)

### Workflow: Filter by Status

#### Step-by-Step Process

1. **Access Workflow Management**
   - Navigate to: `/workflow-management`
   - Shows list of all entries

2. **Filter by Status**
   - Select status from dropdown
   - Options: All, Draft, In Review, Ready for Approval, Approved, Published, Rejected
   - Results filtered immediately

3. **Filter by Content Type**
   - Select content type from dropdown
   - Shows entries for selected content type

4. **Backend Process**
   - **API Call**: `GET /workflow/content-types/{content_type_id}/entries?status={status}`
   - **Response**: Returns filtered list of entries

---

## Approval Queue

### Overview
Approval Queue provides a focused view of entries that require approval (status: "ready_for_approval"). It allows managers to quickly review and approve/reject multiple entries efficiently.

### Workflow: View Approval Queue

#### Step-by-Step Process

1. **Navigate to Approval Queue**
   - User clicks "Approval Queue" in sidebar
   - Page displays: `/approval-queue`
   - Shows only entries with status "ready_for_approval"

2. **View Pending Approvals**
   - **List View**: Table showing:
     - Entry title
     - Content type
     - Creator
     - Created date
     - Status badge
     - Actions (Approve/Reject)
   - **Stats Cards**: Shows count of pending approvals

3. **Backend Process**
   - **API Call**: `GET /workflow/content-types/{content_type_id}/entries?status=ready_for_approval`
   - **Response**: Returns list of entries awaiting approval

### Workflow: Approve from Queue

#### Step-by-Step Process

1. **Review Entry**
   - From Approval Queue page
   - Click on entry row to view details
   - Navigates to: `/approval-queue/{entry_id}`

2. **Quick Approve**
   - From queue list: Click "Approve" button on row
   - OR from detail page: Click "Approve" button
   - Optional: Add comment
   - Click "Confirm"

3. **Backend Process**
   - **API Call**: `POST /workflow/entries/{entry_id}/approve`
   - **Request Body**: `{ comment }`
   - **Validation**: Checks user role (manager, admin)
   - **Status Change**: Updates to "approved"
   - **History**: Creates `WorkflowHistory` record
   - **Database**: Updates `ContentEntry` and creates `WorkflowHistory`
   - **Response**: Returns updated entry

4. **Update UI**
   - Entry removed from approval queue
   - Success message shown
   - Queue count updates

### Workflow: Reject from Queue

#### Step-by-Step Process

1. **Review Entry**
   - From Approval Queue page
   - Click on entry row to view details

2. **Reject Entry**
   - Click "Reject" button
   - **Required**: Add rejection comment
   - Click "Confirm"

3. **Backend Process**
   - **API Call**: `POST /workflow/entries/{entry_id}/reject`
   - **Request Body**: `{ comment }` (required)
   - **Validation**: Checks user role (manager, admin)
   - **Status Change**: Updates to "rejected"
   - **History**: Creates `WorkflowHistory` record
   - **Database**: Updates `ContentEntry` and creates `WorkflowHistory`
   - **Response**: Returns updated entry

4. **Update UI**
   - Entry removed from approval queue
   - Success message shown
   - Queue count updates

### Workflow: Bulk Actions

#### Step-by-Step Process

1. **Select Multiple Entries**
   - From Approval Queue page
   - Check boxes next to entries
   - Select multiple entries

2. **Bulk Approve**
   - Click "Bulk Approve" button
   - Confirmation dialog appears
   - Click "Confirm"

3. **Backend Process**
   - **API Call**: Multiple `POST /workflow/entries/{entry_id}/approve` calls
   - **Database**: Updates multiple entries
   - **Response**: Returns results summary

4. **Update UI**
   - Selected entries removed from queue
   - Success message shown
   - Queue count updates

---

## User Management

### Overview
User Management allows administrators to create, edit, view, and manage user accounts. It handles user creation, role assignment, status management, and user profile information.

### Workflow: Create User

#### Step-by-Step Process

1. **Navigate to User Management**
   - User clicks "User Management" in sidebar
   - Page displays: `/user-management`
   - Shows list of all users

2. **Initiate Creation**
   - Click "Add New User" button
   - Navigates to: `/user-management/create`

3. **Fill User Form**
   - **Name**: Enter user's full name
   - **Email**: Enter email address (must be unique)
   - **Password**: Enter password (hashed on backend)
   - **Provider**: Select authentication provider (local, google, etc.)
   - **Role**: Select role from dropdown
   - **Status**: Select status (active/inactive)
   - **Profile Picture**: Upload profile image (optional)

4. **Submit User**
   - Click "Create User"
   - Client-side validation runs

5. **Backend Process**
   - **API Call**: `POST /users`
   - **Request Body**: `{ name, email, password, provider, role_id, status, profile }`
   - **Validation**: 
     - Checks email uniqueness
     - Validates password strength
     - Validates role exists
   - **Password Hashing**: Password hashed using bcrypt
   - **Database**: Creates `User` record
   - **Response**: Returns created User (without password)

6. **Redirect**
   - User redirected to: `/user-management/{user_id}`
   - Shows user detail page

### Workflow: Edit User

#### Step-by-Step Process

1. **Access User Detail**
   - From user list
   - Click on user row or eye icon
   - Navigates to: `/user-management/{user_id}`

2. **Initiate Edit**
   - Click "Edit User" button (orange)
   - Navigates to: `/user-management/{user_id}/edit`

3. **Modify User**
   - Edit any user fields
   - **Password**: Optional, leave blank to keep existing
   - **Role**: Change user role
   - **Status**: Change user status

4. **Save Changes**
   - Click "Save Changes"

5. **Backend Process**
   - **API Call**: `PUT /users/{id}`
   - **Request Body**: JSON with updated fields
   - **Validation**: 
     - Checks email uniqueness (if changed)
     - Validates password strength (if changed)
     - Validates role exists
   - **Password Hashing**: Password hashed if changed
   - **Database**: Updates `User` record
   - **Response**: Returns updated User

6. **Redirect**
   - User redirected to: `/user-management/{user_id}`
   - Updated information displayed

### Workflow: View User Details

#### Step-by-Step Process

1. **Access User Detail**
   - Navigate to: `/user-management/{user_id}`

2. **View User Information**
   - **Profile Section**: Avatar, name, email, provider
   - **Role Information**: Role name, badge, description
   - **Status**: Active/Inactive badge
   - **Metadata**: Created date, updated date
   - **Actions**: Edit, Delete buttons

3. **Backend Process**
   - **API Call**: `GET /users/{id}`
   - **Response**: Returns User with role information

### Workflow: Delete User

#### Step-by-Step Process

1. **Initiate Deletion**
   - From user list or detail page
   - Click trash icon
   - Confirmation dialog appears

2. **Confirm Deletion**
   - User confirms deletion
   - System checks if user has created content

3. **Backend Process**
   - **API Call**: `DELETE /users/{id}`
   - **Validation**: Checks for associated content
   - **Database**: Soft deletes `User` record
   - **Response**: Returns success status

4. **Update UI**
   - User removed from list
   - Success message shown

### Workflow: Assign Role to User

#### Step-by-Step Process

1. **Access User Edit**
   - Navigate to user edit page

2. **Change Role**
   - Select new role from dropdown
   - Click "Save Changes"

3. **Backend Process**
   - **API Call**: `PUT /users/{id}` with updated `role_id`
   - **Database**: Updates `User.role_id`
   - **Response**: Returns updated User

4. **Update UI**
   - Role badge updates
   - User permissions updated based on new role

### Workflow: Filter and Search Users

#### Step-by-Step Process

1. **Search Users**
   - Enter search query in search bar
   - Searches name and email
   - Results update in real-time

2. **Filter by Status**
   - Select status from dropdown: All, Active, Inactive
   - Results filtered immediately

3. **Filter by Role**
   - Select role from dropdown
   - Shows users with selected role

4. **Backend Process**
   - **API Call**: `GET /users?search={query}&status={status}&role={role_id}`
   - **Response**: Returns filtered list of users

---

## Role & Permissions

### Overview
Role & Permissions allows administrators to define roles and assign granular permissions. Permissions control access to modules, actions, and specific fields within the CMS.

### Permission Structure

Permissions consist of:
- **Module**: The feature/module (e.g., "ContentEntry", "Media", "SEO")
- **Action**: The operation (e.g., "create", "read", "update", "delete", "approve")
- **Field Scope**: Field-level access control ("all", "seo_only", "non_seo_only", "custom")
- **Allowed Fields**: Specific fields user can access (if field_scope is "custom")
- **Denied Fields**: Specific fields user cannot access
- **Content Type IDs**: Limit permission to specific content types

### Workflow: Create Role

#### Step-by-Step Process

1. **Navigate to Role & Permissions**
   - User clicks "Role & Permissions" in sidebar
   - Page displays: `/role-permissions`
   - Shows list of all roles

2. **Initiate Creation**
   - Click "Create New Role" button
   - Navigates to: `/role-permissions/create`

3. **Fill Role Form**
   - **Role Name**: Enter role name (e.g., "editor", "manager")
   - **Description**: Enter role description
   - **Permissions**: Select permissions using permission matrix:
     - **Content Entry Module**:
       - Create, Read, Update, Delete, Approve
       - Field scope: All, SEO Only, Non-SEO Only, Custom
       - Allowed/Denied fields (if custom)
       - Content type restrictions
     - **Media Module**:
       - Create, Read, Update, Delete
     - **SEO Module**:
       - Read, Update

4. **Configure Permissions**
   - Check/uncheck permissions in matrix
   - Set field scope for Content Entry permissions
   - If field scope is "custom":
     - Select allowed fields
     - Select denied fields
   - Select content types (if restricting to specific types)

5. **Submit Role**
   - Click "Create Role"
   - Client-side validation runs

6. **Backend Process**
   - **API Call**: `POST /roles`
   - **Request Body**: `{ name, description, permissions: [...] }`
   - **Validation**: 
     - Checks role name uniqueness
     - Validates permission structure
   - **Database**: 
     - Creates `Role` record
     - Creates `Permission` records for each permission
   - **Response**: Returns created Role with permissions

7. **Redirect**
   - User redirected to: `/role-permissions/{role_id}`
   - Shows role detail page

### Workflow: Edit Role

#### Step-by-Step Process

1. **Access Role Detail**
   - From role list
   - Click on role row or eye icon
   - Navigates to: `/role-permissions/{role_id}`

2. **Initiate Edit**
   - Click "Edit Role" button (orange)
   - Navigates to: `/role-permissions/{role_id}/edit`

3. **Modify Role**
   - Edit role name or description
   - Modify permissions in matrix
   - Add or remove permissions
   - Change field scopes
   - Update allowed/denied fields

4. **Save Changes**
   - Click "Save Changes"

5. **Backend Process**
   - **API Call**: `PUT /roles/{id}`
   - **Request Body**: JSON with updated role and permissions
   - **Validation**: Validates permission structure
   - **Database**: 
     - Updates `Role` record
     - Updates or creates `Permission` records
   - **Response**: Returns updated Role

6. **Redirect**
   - User redirected to: `/role-permissions/{role_id}`
   - Updated information displayed

### Workflow: Duplicate Role

#### Step-by-Step Process

1. **Initiate Duplication**
   - From role list
   - Click duplicate icon (copy) on role row
   - Confirmation dialog appears

2. **Confirm Duplication**
   - User confirms duplication

3. **Backend Process**
   - **API Call**: `POST /roles/{id}/duplicate`
   - **Database**: 
     - Creates new `Role` with "- Copy" suffix
     - Copies all `Permission` records
   - **Response**: Returns duplicated Role

4. **Redirect**
   - User redirected to: `/role-permissions/{new_role_id}/edit`
   - Can modify duplicated role
   - Name pre-filled with "Copy" suffix

### Workflow: Delete Role

#### Step-by-Step Process

1. **Initiate Deletion**
   - From role list or detail page
   - Click trash icon
   - Confirmation dialog appears

2. **Confirm Deletion**
   - System checks if role is assigned to users
   - If users exist, deletion blocked with warning
   - User confirms deletion

3. **Backend Process**
   - **API Call**: `DELETE /roles/{id}`
   - **Validation**: Checks if role is assigned to users
   - **Database**: 
     - If assigned: Returns error
     - If not assigned: Soft deletes `Role` and related `Permission` records
   - **Response**: Returns success status or error

4. **Update UI**
   - If successful: Role removed from list
   - If error: Error message shown

### Workflow: View Role Details

#### Step-by-Step Process

1. **Access Role Detail**
   - Navigate to: `/role-permissions/{role_id}`

2. **View Role Information**
   - **Basic Info**: Role name, description
   - **Permissions Matrix**: Table showing all permissions
   - **Users Count**: Number of users with this role
   - **Metadata**: Created date, updated date
   - **Actions**: Edit, Duplicate, Delete buttons

3. **Permissions Display**
   - **Module**: Shows module name
   - **Action**: Shows allowed actions
   - **Field Scope**: Shows field scope type
   - **Fields**: Shows allowed/denied fields (if custom)
   - **Content Types**: Shows restricted content types (if any)

4. **Backend Process**
   - **API Call**: `GET /roles/{id}`
   - **Response**: Returns Role with all permissions

### Workflow: Assign Role to User

#### Step-by-Step Process

1. **Access User Edit**
   - Navigate to user edit page

2. **Select Role**
   - Select role from dropdown
   - Click "Save Changes"

3. **Backend Process**
   - **API Call**: `POST /roles/assign`
   - **Request Body**: `{ user_id, role_id }`
   - **Database**: Updates `User.role_id`
   - **Response**: Returns success status

4. **Update UI**
   - User role updated
   - User permissions updated based on new role

### Workflow: Filter Roles

#### Step-by-Step Process

1. **Search Roles**
   - Enter search query in search bar
   - Searches role name and description
   - Results update in real-time

2. **Filter by Module**
   - Select module from dropdown
   - Options: All Modules, Content Entry, Media, SEO
   - Shows roles with permissions for selected module

3. **Backend Process**
   - **API Call**: `GET /roles?search={query}&module={module}`
   - **Response**: Returns filtered list of roles

---

## Cross-Feature Workflows

### Workflow: Complete Content Lifecycle

#### Overview
This workflow demonstrates the complete lifecycle of content from creation to publication, involving multiple features.

#### Step-by-Step Process

1. **Content Builder: Create Content Type**
   - Admin creates "Article" content type
   - Adds fields: title, body, featured_image
   - Enables SEO: Adds meta_title, meta_description fields

2. **Content Management: Create Entry**
   - Editor creates new article entry
   - Fills title, body, featured_image
   - Fills SEO fields: meta_title, meta_description
   - Entry created with status "draft"

3. **Media Library: Upload Image**
   - Editor uploads featured image
   - Image stored in Media Library
   - Image URL referenced in entry

4. **Content Management: Edit Entry**
   - Editor edits entry content
   - Updates fields as needed
   - Status remains "draft"

5. **SEO Preview: Preview SEO**
   - Editor clicks "SEO Preview"
   - Views Google, Facebook, Twitter previews
   - Verifies SEO metadata

6. **Workflow Management: Request Review**
   - Editor clicks "Request Review"
   - Status changes to "in_review"
   - Reviewer notified

7. **Workflow Management: Submit for Approval**
   - Reviewer reviews entry
   - Adds comments
   - Changes status to "ready_for_approval"
   - Manager notified

8. **Approval Queue: Approve Entry**
   - Manager views entry in Approval Queue
   - Reviews content and comments
   - Approves entry
   - Status changes to "approved"

9. **Workflow Management: Publish Entry**
   - Manager publishes approved entry
   - Status changes to "published"
   - Published date set
   - Entry becomes live

10. **Content Relations: Link Related Content**
    - Admin creates relation between articles
    - Related articles displayed on entry page

11. **Search: Find Entry**
    - User searches for article
    - Entry appears in search results
    - User navigates to entry detail

---

## API Endpoints Reference

### Content Builder
- `POST /content/types` - Create content type
- `GET /content/types` - List content types
- `GET /content/types/:id` - Get content type
- `PUT /content/types/:id` - Update content type
- `DELETE /content/types/:id` - Delete content type
- `POST /content/types/:id/fields` - Add field
- `PUT /content/fields/:field_id` - Update field
- `DELETE /content/fields/:field_id` - Delete field
- `GET /content/fields/:field_id/validation` - Get validation rules
- `GET /content/types/:id/api-reference` - Get API reference

### Content Management
- `POST /content/:content_type_id/entries` - Create entry
- `GET /content/:content_type_id/entries` - List entries
- `GET /content/entries/:entry_id` - Get entry
- `PUT /content/entries/:entry_id` - Update entry
- `DELETE /content/entries/:entry_id` - Delete entry
- `GET /content/entries/:entry_id/seo-preview` - Get SEO preview

### Content Relations
- `POST /content/:from_content_id/relations` - Create relation
- `GET /content/:from_content_id/relations` - List relations
- `DELETE /content/relations/:relation_id` - Delete relation

### Media Library
- `POST /media/upload` - Upload media
- `POST /media/bulk-upload` - Bulk upload
- `GET /media` - List media
- `GET /media/:id` - Get media
- `PUT /media/:id` - Update media
- `DELETE /media/:id` - Delete media
- `POST /media/folders` - Create folder
- `GET /media/folders` - List folders
- `GET /media/search` - Search media

### Workflow Management
- `POST /workflow/entries/:entry_id/status` - Change status
- `POST /workflow/entries/:entry_id/request-review` - Request review
- `POST /workflow/entries/:entry_id/approve` - Approve entry
- `POST /workflow/entries/:entry_id/reject` - Reject entry
- `POST /workflow/entries/:entry_id/publish` - Publish entry
- `GET /workflow/entries/:entry_id/history` - Get history
- `POST /workflow/entries/:entry_id/comments` - Add comment
- `GET /workflow/entries/:entry_id/comments` - Get comments
- `POST /workflow/entries/:entry_id/assign` - Assign entry
- `GET /workflow/assignments` - Get assignments
- `GET /workflow/content-types/:id/entries` - Get entries by status
- `GET /workflow/content-types/:id/stats` - Get workflow stats

### User Management
- `POST /users` - Create user
- `GET /users` - List users
- `GET /users/:id` - Get user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Role & Permissions
- `POST /roles` - Create role
- `GET /roles` - List roles
- `GET /roles/:id` - Get role
- `PUT /roles/:id` - Update role
- `DELETE /roles/:id` - Delete role
- `POST /roles/:id/duplicate` - Duplicate role
- `POST /roles/assign` - Assign role to user

### Search
- `GET /search/entries` - Full-text search
- `POST /search/advanced` - Advanced search
- `GET /search/facets` - Get search facets
- `GET /search/autocomplete` - Get autocomplete suggestions
- `GET /search/entries/:entry_id/related` - Get related entries
- `POST /search/bulk` - Bulk search
- `GET /search/stats` - Get search statistics

---

## Permission Matrix

### Role-Based Permissions

#### Admin Role
- **All Modules**: Full access (create, read, update, delete, approve)
- **Content Entry**: Create, Read, Update (all fields), Delete, Approve
- **Media**: Create, Read, Update, Delete
- **SEO**: Create, Read, Update, Delete (all fields)
- **Workflow**: All status transitions
- **User Management**: Full access
- **Role & Permissions**: Full access

#### Editor Role
- **Content Entry**: Create, Read, Update (all fields)
- **Media**: Create, Read, Update
- **SEO**: Read (all fields)
- **Workflow**: Can change status from draft → in_review → ready_for_approval

#### Manager Role
- **Content Entry**: Read (all fields), Approve
- **Media**: Read
- **SEO**: Read (all fields)
- **Workflow**: Can approve, reject, publish entries

#### Viewer Role
- **Content Entry**: Read (all fields)
- **Media**: Read
- **SEO**: Read (all fields)
- **Workflow**: View only, no status changes

#### SEO Specialist Role
- **Content Entry**: Read (all fields), Update (SEO fields only)
- **Media**: Read
- **SEO**: Create, Read, Update (all fields)
- **Workflow**: View only, no status changes

#### Content Writer Role
- **Content Entry**: Create, Read, Update (non-SEO fields only)
- **Media**: Create, Read
- **SEO**: No access
- **Workflow**: Can change status from draft → in_review → ready_for_approval

---

## Status Transition Rules

### Valid Transitions

| From Status | To Status | Required Role |
|------------|-----------|---------------|
| draft | in_review | editor, admin |
| in_review | ready_for_approval | editor, admin |
| in_review | rejected | editor, admin |
| in_review | draft | editor, admin |
| ready_for_approval | approved | manager, admin |
| ready_for_approval | rejected | manager, admin |
| approved | published | manager, admin |
| rejected | draft | editor, admin |

### Transition Restrictions
- Status transitions are validated against user role
- Invalid transitions are rejected with error message
- All transitions are logged in WorkflowHistory

---

## Error Handling

### Common Error Scenarios

1. **Validation Errors**
   - Field validation fails
   - Error message displayed to user
   - Invalid fields highlighted

2. **Permission Errors**
   - User lacks required permission
   - Action blocked
   - Error message explains missing permission

3. **Status Transition Errors**
   - Invalid status transition
   - Transition blocked
   - Error message shows valid transitions

4. **Not Found Errors**
   - Resource not found
   - 404 error displayed
   - User redirected to appropriate page

5. **Duplicate Errors**
   - Unique constraint violation
   - Error message displayed
   - User prompted to change value

---

## Notes

- All timestamps are stored in UTC and displayed in user's local timezone
- Soft deletes are used for content types, entries, users, and roles
- All actions are logged for audit purposes
- File uploads are validated for type and size
- Password hashing uses bcrypt with appropriate cost factor
- API responses follow consistent JSON structure
- Error messages are user-friendly and actionable

---

## Conclusion

This documentation provides a comprehensive overview of all workflows within the CMS platform. Each feature is designed to work independently while integrating seamlessly with other features to provide a complete content management solution.

For API-specific documentation, refer to:
- `backend/REST_API.md` - REST API documentation
- `backend/GRAPHQL_API.md` - GraphQL API documentation

For frontend component documentation, refer to:
- Component files in `frontend/components/`
- Page files in `frontend/app/`

