// Types and dummy data for Content Builder (Content Types Management)

export interface ContentType {
  id: number;
  name: string;
  slug: string;
  enableSeo: boolean;
  fieldsCount: number;
  entriesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ContentField {
  id: number;
  contentTypeId: number;
  name: string;
  type: string; // string, text, number, boolean, date, media, email, url
  required: boolean;
  isSeo: boolean;
  unique: boolean;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  minValue?: number;
  maxValue?: number;
  defaultValue?: string;
  placeholder?: string;
  helpText?: string;
  createdAt: string;
  updatedAt: string;
}

// Field type options
export const fieldTypes = [
  { value: "string", label: "Text (Short)" },
  { value: "text", label: "Text (Long)" },
  { value: "number", label: "Number" },
  { value: "boolean", label: "Boolean" },
  { value: "date", label: "Date" },
  { value: "media", label: "Media" },
  { value: "email", label: "Email" },
  { value: "url", label: "URL" },
];

// Dummy Data
export const dummyContentTypes: ContentType[] = [
  {
    id: 1,
    name: "Article",
    slug: "article",
    enableSeo: true,
    fieldsCount: 5,
    entriesCount: 12,
    createdAt: "2024-01-15",
    updatedAt: "2024-10-20",
  },
  {
    id: 2,
    name: "Product",
    slug: "product",
    enableSeo: true,
    fieldsCount: 8,
    entriesCount: 45,
    createdAt: "2024-02-10",
    updatedAt: "2024-10-18",
  },
  {
    id: 3,
    name: "Page",
    slug: "page",
    enableSeo: true,
    fieldsCount: 4,
    entriesCount: 8,
    createdAt: "2024-03-05",
    updatedAt: "2024-10-15",
  },
  {
    id: 4,
    name: "Category",
    slug: "category",
    enableSeo: false,
    fieldsCount: 3,
    entriesCount: 20,
    createdAt: "2024-04-12",
    updatedAt: "2024-10-10",
  },
  {
    id: 5,
    name: "Testimonial",
    slug: "testimonial",
    enableSeo: false,
    fieldsCount: 4,
    entriesCount: 15,
    createdAt: "2024-05-20",
    updatedAt: "2024-09-25",
  },
];

export const dummyFields: Record<number, ContentField[]> = {
  1: [
    // Article fields
    {
      id: 1,
      contentTypeId: 1,
      name: "title",
      type: "string",
      required: true,
      isSeo: false,
      unique: false,
      maxLength: 200,
      placeholder: "Enter article title",
      helpText: "The main title of the article",
      createdAt: "2024-01-15",
      updatedAt: "2024-01-15",
    },
    {
      id: 2,
      contentTypeId: 1,
      name: "body",
      type: "text",
      required: true,
      isSeo: false,
      unique: false,
      placeholder: "Write article content",
      createdAt: "2024-01-15",
      updatedAt: "2024-01-15",
    },
    {
      id: 3,
      contentTypeId: 1,
      name: "featured_image",
      type: "media",
      required: false,
      isSeo: false,
      unique: false,
      createdAt: "2024-01-15",
      updatedAt: "2024-01-15",
    },
    {
      id: 4,
      contentTypeId: 1,
      name: "meta_title",
      type: "string",
      required: false,
      isSeo: true,
      unique: false,
      maxLength: 60,
      placeholder: "SEO meta title",
      createdAt: "2024-01-15",
      updatedAt: "2024-01-15",
    },
    {
      id: 5,
      contentTypeId: 1,
      name: "meta_description",
      type: "text",
      required: false,
      isSeo: true,
      unique: false,
      maxLength: 160,
      placeholder: "SEO meta description",
      createdAt: "2024-01-15",
      updatedAt: "2024-01-15",
    },
  ],
  2: [
    // Product fields
    {
      id: 6,
      contentTypeId: 2,
      name: "name",
      type: "string",
      required: true,
      isSeo: false,
      unique: true,
      maxLength: 100,
      createdAt: "2024-02-10",
      updatedAt: "2024-02-10",
    },
    {
      id: 7,
      contentTypeId: 2,
      name: "price",
      type: "number",
      required: true,
      isSeo: false,
      unique: false,
      minValue: 0,
      createdAt: "2024-02-10",
      updatedAt: "2024-02-10",
    },
    {
      id: 8,
      contentTypeId: 2,
      name: "description",
      type: "text",
      required: false,
      isSeo: false,
      unique: false,
      createdAt: "2024-02-10",
      updatedAt: "2024-02-10",
    },
    {
      id: 9,
      contentTypeId: 2,
      name: "image",
      type: "media",
      required: true,
      isSeo: false,
      unique: false,
      createdAt: "2024-02-10",
      updatedAt: "2024-02-10",
    },
    {
      id: 10,
      contentTypeId: 2,
      name: "in_stock",
      type: "boolean",
      required: false,
      isSeo: false,
      unique: false,
      defaultValue: "true",
      createdAt: "2024-02-10",
      updatedAt: "2024-02-10",
    },
    {
      id: 11,
      contentTypeId: 2,
      name: "meta_title",
      type: "string",
      required: false,
      isSeo: true,
      unique: false,
      maxLength: 60,
      createdAt: "2024-02-10",
      updatedAt: "2024-02-10",
    },
    {
      id: 12,
      contentTypeId: 2,
      name: "meta_description",
      type: "text",
      required: false,
      isSeo: true,
      unique: false,
      maxLength: 160,
      createdAt: "2024-02-10",
      updatedAt: "2024-02-10",
    },
    {
      id: 13,
      contentTypeId: 2,
      name: "slug",
      type: "string",
      required: true,
      isSeo: false,
      unique: true,
      pattern: "^[a-z0-9-]+$",
      placeholder: "product-slug",
      createdAt: "2024-02-10",
      updatedAt: "2024-02-10",
    },
  ],
  3: [
    // Page fields
    {
      id: 14,
      contentTypeId: 3,
      name: "title",
      type: "string",
      required: true,
      isSeo: false,
      unique: false,
      maxLength: 100,
      createdAt: "2024-03-05",
      updatedAt: "2024-03-05",
    },
    {
      id: 15,
      contentTypeId: 3,
      name: "content",
      type: "text",
      required: true,
      isSeo: false,
      unique: false,
      createdAt: "2024-03-05",
      updatedAt: "2024-03-05",
    },
    {
      id: 16,
      contentTypeId: 3,
      name: "meta_title",
      type: "string",
      required: false,
      isSeo: true,
      unique: false,
      maxLength: 60,
      createdAt: "2024-03-05",
      updatedAt: "2024-03-05",
    },
    {
      id: 17,
      contentTypeId: 3,
      name: "meta_description",
      type: "text",
      required: false,
      isSeo: true,
      unique: false,
      maxLength: 160,
      createdAt: "2024-03-05",
      updatedAt: "2024-03-05",
    },
  ],
  4: [
    // Category fields
    {
      id: 18,
      contentTypeId: 4,
      name: "name",
      type: "string",
      required: true,
      isSeo: false,
      unique: true,
      maxLength: 50,
      createdAt: "2024-04-12",
      updatedAt: "2024-04-12",
    },
    {
      id: 19,
      contentTypeId: 4,
      name: "description",
      type: "text",
      required: false,
      isSeo: false,
      unique: false,
      createdAt: "2024-04-12",
      updatedAt: "2024-04-12",
    },
    {
      id: 20,
      contentTypeId: 4,
      name: "icon",
      type: "media",
      required: false,
      isSeo: false,
      unique: false,
      createdAt: "2024-04-12",
      updatedAt: "2024-04-12",
    },
  ],
  5: [
    // Testimonial fields
    {
      id: 21,
      contentTypeId: 5,
      name: "author_name",
      type: "string",
      required: true,
      isSeo: false,
      unique: false,
      maxLength: 100,
      createdAt: "2024-05-20",
      updatedAt: "2024-05-20",
    },
    {
      id: 22,
      contentTypeId: 5,
      name: "author_role",
      type: "string",
      required: false,
      isSeo: false,
      unique: false,
      maxLength: 50,
      createdAt: "2024-05-20",
      updatedAt: "2024-05-20",
    },
    {
      id: 23,
      contentTypeId: 5,
      name: "testimonial_text",
      type: "text",
      required: true,
      isSeo: false,
      unique: false,
      createdAt: "2024-05-20",
      updatedAt: "2024-05-20",
    },
    {
      id: 24,
      contentTypeId: 5,
      name: "author_photo",
      type: "media",
      required: false,
      isSeo: false,
      unique: false,
      createdAt: "2024-05-20",
      updatedAt: "2024-05-20",
    },
  ],
};

// Helper functions
export const getContentTypeById = (id: number): ContentType | undefined => {
  return dummyContentTypes.find((ct) => ct.id === id);
};

export const getFieldsByContentTypeId = (contentTypeId: number): ContentField[] => {
  return dummyFields[contentTypeId] || [];
};

export const formatSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

export const getFieldTypeLabel = (type: string): string => {
  return fieldTypes.find((ft) => ft.value === type)?.label || type;
};

