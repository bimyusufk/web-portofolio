# Thumbnail and Gallery Feature Implementation

## ✅ What Was Added

### Database Schema Updates
- Added `thumbnailId` field to **Project**, **Research**, **Experience**, and **Activity** models
- Added gallery relationships to **Project** and **Research** models for multiple image uploads
- Created proper foreign key relationships with the Media model

### New UI Components
1. **ImagePicker Component** (`src/components/image-picker.tsx`)
   - Modal-based image selection
   - Upload new images directly from the picker
   - Search and filter functionality
   - Preview selected thumbnail

2. **GalleryManager Component** (`src/components/gallery-manager.tsx`)
   - Multi-image upload for projects and research
   - Drag-and-drop support (UI ready)
   - Image reordering (prepared for implementation)
   - Remove images from gallery

### Updated tRPC API
- Extended `content.ts` router with:
  - `thumbnailId` support for all content types
  - `galleryIds` array handling for Projects and Research
  - Proper relation includes when fetching data

## 📝 Next Steps to Complete Integration

### 1. Update Form Pages
You need to add the ImagePicker and GalleryManager components to your create/edit forms:

#### For Projects (`/admin/content/projects/new` and `/[id]/edit`):
```tsx
import { ImagePicker } from "@/components/image-picker";
import { GalleryManager } from "@/components/gallery-manager";

// In your form component:
const [thumbnailId, setThumbnailId] = useState<string | null>(null);
const [galleryIds, setGalleryIds] = useState<string[]>([]);

// In your JSX:
<ImagePicker
  selectedImageId={thumbnailId}
  onSelect={(id, url) => setThumbnailId(id)}
  label="Project Thumbnail"
  aspectRatio="video"
/>

<GalleryManager
  galleryImageIds={galleryIds}
  onChange={setGalleryIds}
  label="Project Gallery"
/>

// Include in form submission:
thumbnailId,
galleryIds,
```

#### For Research (`/admin/content/research/new` and `/[id]/edit`):
Same as Projects - add both ImagePicker and GalleryManager

#### For Experience (`/admin/experience/new` and `/[id]/edit`):
```tsx
<ImagePicker
  selectedImageId={thumbnailId}
  onSelect={(id, url) => setThumbnailId(id)}
  label="Company Logo"
  aspectRatio="square"
/>

// Include in form submission:
thumbnailId,
```

#### For Activities (`/admin/activities/new` and `/[id]/edit`):
```tsx
<ImagePicker
  selectedImageId={thumbnailId}
  onSelect={(id, url) => setThumbnailId(id)}
  label="Activity Thumbnail"
  aspectRatio="auto"
/>

// Include in form submission:
thumbnailId,
```

### 2. Display Thumbnails in Public Pages
Update your public-facing pages to show thumbnails:

**Projects List** (`/projects`):
```tsx
{project.thumbnail && (
  <Image
    src={project.thumbnail.url}
    alt={project.title}
    width={600}
    height={400}
    className="aspect-video object-cover"
  />
)}
```

**Research List** (`/research`):
Similar to projects

**Experience List** (`/experience`):
```tsx
{experience.thumbnail && (
  <Image
    src={experience.thumbnail.url}
    alt={experience.company}
    width={80}
    height={80}
    className="rounded-full"
  />
)}
```

### 3. Display Gallery on Detail Pages
For project and research detail pages:

```tsx
{project.gallery && project.gallery.length > 0 && (
  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
    {project.gallery.map((image) => (
      <Image
        key={image.id}
        src={image.url}
        alt={image.altText || "Project image"}
        width={400}
        height={300}
        className="rounded-lg"
      />
    ))}
  </div>
)}
```

## 🚀 How to Use

### Uploading a Thumbnail:
1. Go to any create/edit form (after you add the component)
2. Click on the "Select Thumbnail" button
3. Choose from existing images or upload a new one
4. The selected image will be displayed

### Managing Gallery:
1. On Project or Research forms
2. Click "Add Images to Gallery"
3. Select multiple images or upload new ones
4. Images are displayed in order
5. Click the trash icon to remove images

## 🔧 Technical Details

### Database Migration
- Migration file: `20251216173330_add_thumbnails_and_galleries`
- All changes have been applied to your Supabase database

### Prisma Relations
- **One-to-one**: `thumbnailId` → `Media` (nullable)
- **One-to-many**: `Project/Research` → `Media[]` gallery (with cascade delete)

### API Changes
- `createProject/Research` now accepts `thumbnailId` and `galleryIds[]`
- `getProject/Research` returns full thumbnail and gallery objects
- `updateProject/Research` can modify thumbnailId and replace entire gallery

## 📚 Example Implementation

Check `/admin/media/page.tsx` for an example of how the ImagePicker component works with the Media API.

---

**Status**: ✅ Backend Complete | ⏳ Frontend Integration Needed

Once you add the components to your forms and update the public pages to display images, the feature will be fully functional!
