import prisma from '#utils/prisma'

async function main() {
  const categories = [
    {
      name: 'JavaScript',
      description: 'Bahasa pemrograman untuk membangun website interaktif dan aplikasi web modern.'
    },
    {
      name: 'TypeScript',
      description: 'JavaScript dengan static typing untuk aplikasi yang lebih aman dan scalable.'
    },
    {
      name: 'Python',
      description: 'Bahasa pemrograman serbaguna untuk web, AI, data science, dan automation.'
    },
    {
      name: 'Go',
      description: 'Bahasa pemrograman cepat untuk backend, microservices, dan cloud computing.'
    },
    {
      name: 'Java',
      description: 'Bahasa pemrograman populer untuk backend enterprise dan Android.'
    },
    {
      name: 'Kotlin',
      description: 'Bahasa modern untuk Android dan backend yang kompatibel dengan Java.'
    },
    {
      name: 'Dart',
      description: 'Bahasa pemrograman yang digunakan bersama Flutter untuk aplikasi multiplatform.'
    },
    {
      name: 'SQL',
      description: 'Bahasa query untuk mengelola dan mengambil data dari database.'
    }
  ]

  for (const category of categories) {
    await prisma.category.upsert({
      where: {
        name: category.name
      },
      update: {},
      create: category
    })
  }

  console.log('✅ Category seed completed')
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  })