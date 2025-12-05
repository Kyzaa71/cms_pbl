| Method | Path | Description |
| --- | --- | --- |
| GET | /health | Health check |
| POST | /graphql | GraphQL endpoint |
| GET | /graphql | GraphiQL playground |
| POST | /graphql/batch | Batch GraphQL |
| POST | /auth/register | Register |
| POST | /auth/login | Login |
| GET | /auth/google/login | Google OAuth login |
| GET | /auth/google/callback | Google OAuth callback |
| POST | /auth/forgot-password | Forgot password |
| POST | /auth/reset-password | Reset password |
| POST | /auth/refresh | Refresh tokens |
| POST | /auth/logout | Logout |
| POST | /users/ | Create user |
| GET | /users/ | List users |
| GET | /users/:id | Get user |
| PUT | /users/:id | Update user |
| DELETE | /users/:id | Delete user |
| POST | /roles/ | Create role |
| GET | /roles/ | List roles |
| GET | /roles/:id | Get role |
| PUT | /roles/:id | Update role |
| DELETE | /roles/:id | Delete role |
| POST | /roles/:id/duplicate | Duplicate role |
| POST | /roles/assign | Assign role to user |
| POST | /content/types | Create content type |
| GET | /content/types | List content types |
| GET | /content/types/:id | Get content type |
| PUT | /content/types/:id | Update content type |
| DELETE | /content/types/:id | Delete content type |
| POST | /content/types/:content_type_id/fields | Add field |
| PUT | /content/fields/:field_id | Update field |
| DELETE | /content/fields/:field_id | Delete field |
| POST | /content/:content_type_id/entries | Create entry |
| GET | /content/:content_type_id/entries | List entries |
| POST | /content/:content_type_id/entries/json | Create entry (JSON) |
| GET | /content/entries/:entry_id | Get entry |
| PUT | /content/entries/:entry_id | Update entry |
| DELETE | /content/entries/:entry_id | Delete entry |
| POST | /content/entries/:entry_id/translate | Translate entry |
| GET | /content/entries/:entry_id/seo-preview | SEO preview |
| POST | /content/:from_content_id/relations | Create relation |
| GET | /content/:from_content_id/relations | List relations |
| DELETE | /content/relations/:relation_id | Delete relation |
| GET | /content/types/:id/api-reference | API reference |
| GET | /content/types/:id/openapi | OpenAPI spec |
| GET | /content/types/:id/docs/markdown | Markdown docs |
| GET | /content/fields/:field_id/validation | Field validation |
| GET | /media/folders | List folders |
| POST | /media/folders | Create folder |
| POST | /media/upload | Upload media |
| POST | /media/bulk-upload | Bulk upload |
| GET | /media/ | List media |
| GET | /media/search | Search media |
| GET | /media/stats | Media stats |
| GET | /media/:id | Get media |
| PUT | /media/:id | Update media |
| DELETE | /media/:id | Delete media |
| POST | /workflow/entries/:entry_id/status | Change status |
| POST | /workflow/entries/:entry_id/request-review | Request review |
| POST | /workflow/entries/:entry_id/approve | Approve entry |
| POST | /workflow/entries/:entry_id/reject | Reject entry |
| POST | /workflow/entries/:entry_id/publish | Publish entry |
| GET | /workflow/entries/:entry_id/history | Get history |
| POST | /workflow/entries/:entry_id/comments | Add comment |
| GET | /workflow/entries/:entry_id/comments | Get comments |
| POST | /workflow/entries/:entry_id/assign | Assign entry |
| GET | /workflow/assignments | My assignments |
| PUT | /workflow/assignments/:assignment_id/complete | Complete assignment |
| GET | /workflow/content-types/:content_type_id/entries | Entries by status |
| GET | /workflow/content-types/:content_type_id/stats | Workflow stats |
| GET | /search/entries | Search entries |
| POST | /search/advanced | Advanced search |
| GET | /search/facets | Search facets |
| GET | /search/autocomplete | Autocomplete |
| GET | /search/entries/:entry_id/related | Search by relation |
| POST | /search/bulk | Bulk search |
| GET | /search/export | Export results |
| GET | /search/stats | Search stats |
| GET | /search/suggestions | Search suggestions |

