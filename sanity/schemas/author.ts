export default {
  name: 'author',
  title: '작성자',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: '이름',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
    },
    {
      name: 'image',
      title: '프로필 이미지',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'bio',
      title: '소개',
      type: 'text',
      rows: 3,
    },
    {
      name: 'social',
      title: '소셜 링크',
      type: 'object',
      fields: [
        { name: 'instagram', title: 'Instagram', type: 'url' },
        { name: 'twitter', title: 'Twitter/X', type: 'url' },
        { name: 'website', title: '웹사이트', type: 'url' },
      ],
    },
  ],
  preview: {
    select: {
      title: 'name',
      media: 'image',
    },
  },
};
