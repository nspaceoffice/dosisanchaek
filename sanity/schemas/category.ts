export default {
  name: 'category',
  title: '카테고리',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: '카테고리명',
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
      name: 'description',
      title: '설명',
      type: 'text',
      rows: 2,
    },
    {
      name: 'icon',
      title: '아이콘',
      type: 'string',
      description: '이모지 또는 아이콘 코드',
    },
  ],
};
