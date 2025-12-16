export default {
  name: 'post',
  title: '포스트',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: '제목',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'author',
      title: '작성자',
      type: 'reference',
      to: [{ type: 'author' }],
    },
    {
      name: 'mainImage',
      title: '대표 이미지',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          title: '대체 텍스트',
          type: 'string',
        },
      ],
    },
    {
      name: 'category',
      title: '카테고리',
      type: 'reference',
      to: [{ type: 'category' }],
    },
    {
      name: 'excerpt',
      title: '요약',
      type: 'text',
      rows: 3,
    },
    {
      name: 'body',
      title: '본문',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: '일반', value: 'normal' },
            { title: '제목 2', value: 'h2' },
            { title: '제목 3', value: 'h3' },
            { title: '인용', value: 'blockquote' },
          ],
        },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              title: '대체 텍스트',
              type: 'string',
            },
            {
              name: 'caption',
              title: '캡션',
              type: 'string',
            },
          ],
        },
      ],
    },
    {
      name: 'videoUrl',
      title: '비디오 URL',
      type: 'url',
      description: 'YouTube 또는 Vimeo URL',
    },
    {
      name: 'gallery',
      title: '갤러리',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              title: '대체 텍스트',
              type: 'string',
            },
          ],
        },
      ],
    },
    {
      name: 'tags',
      title: '태그',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    },
    {
      name: 'publishedAt',
      title: '발행일',
      type: 'datetime',
    },
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
    },
    prepare(selection: any) {
      const { author } = selection;
      return { ...selection, subtitle: author && `by ${author}` };
    },
  },
};
