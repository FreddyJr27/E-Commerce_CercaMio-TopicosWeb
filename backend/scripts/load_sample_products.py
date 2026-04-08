import random
import uuid

from products.models import Categoria, Dimensiones, Producto, Usuario

TARGET_PER_CATEGORY = 4

DEFAULT_IMAGE = 'https://picsum.photos/seed/producto/640/480'

IMAGE_MAP = {
    'beauty': 'https://picsum.photos/seed/beauty/640/480',
    'fragrances': 'https://picsum.photos/seed/fragrances/640/480',
    'furniture': 'https://picsum.photos/seed/furniture/640/480',
    'groceries': 'https://picsum.photos/seed/groceries/640/480',
    'home decoration': 'https://picsum.photos/seed/home/640/480',
    'kitchen accessories': 'https://picsum.photos/seed/kitchen/640/480',
    'laptops': 'https://picsum.photos/seed/laptops/640/480',
    'mens shirts': 'https://picsum.photos/seed/mens-shirts/640/480',
    'mens shoes': 'https://picsum.photos/seed/mens-shoes/640/480',
    'mens watches': 'https://picsum.photos/seed/mens-watches/640/480',
    'mobile accessories': 'https://picsum.photos/seed/mobile-accessories/640/480',
    'motorcycle': 'https://picsum.photos/seed/motorcycle/640/480',
    'skin care': 'https://picsum.photos/seed/skin-care/640/480',
    'smartphones': 'https://picsum.photos/seed/smartphones/640/480',
    'sports accessories': 'https://picsum.photos/seed/sports/640/480',
    'sunglasses': 'https://picsum.photos/seed/sunglasses/640/480',
    'tablets': 'https://picsum.photos/seed/tablets/640/480',
    'tops': 'https://picsum.photos/seed/tops/640/480',
    'vehicle': 'https://picsum.photos/seed/vehicle/640/480',
    'womens bags': 'https://picsum.photos/seed/womens-bags/640/480',
    'womens dresses': 'https://picsum.photos/seed/womens-dresses/640/480',
    'womens jewellery': 'https://picsum.photos/seed/womens-jewellery/640/480',
    'womens shoes': 'https://picsum.photos/seed/womens-shoes/640/480',
    'womens watches': 'https://picsum.photos/seed/womens-watches/640/480',
}

MARCAS = ['GenCo', 'Nova', 'Orion', 'Delta', 'Luma']
ESTADOS = ['disponible']
POLITICAS = ['no', 'si']


def get_or_create_seed_user():
    user = Usuario.objects.filter(email='seed@example.com').first()
    if user:
        return user
    return Usuario.objects.create_user(
        username='seed_admin',
        email='seed@example.com',
        password='SeedPass123',
    )


usuario = get_or_create_seed_user()

categorias = Categoria.objects.all()
if not categorias.exists():
    print('No hay categorias. Ejecuta load_categories.py primero.')
else:
    for categoria in categorias:
        existentes = list(Producto.objects.filter(categoria=categoria))
        faltantes = max(TARGET_PER_CATEGORY - len(existentes), 0)

        categoria_key = categoria.nombre.strip().lower()
        imagen_url = IMAGE_MAP.get(categoria_key, DEFAULT_IMAGE)

        for index in range(faltantes):
            dimensiones = Dimensiones.objects.create(
                ancho=random.randint(10, 80),
                alto=random.randint(10, 80),
                profundidad=random.randint(5, 60),
                peso=random.randint(1, 25),
            )

            sku = uuid.uuid4().hex[:12]
            precio = random.randint(5, 500)
            descuento = random.choice([0, 5, 10, 15])

            Producto.objects.create(
                usuario=usuario,
                titulo=f'{categoria.nombre} - Producto {existentes + index + 1}',
                descripcion=f'Producto de ejemplo para {categoria.nombre}.',
                precio=precio,
                descuento=descuento,
                stock=random.randint(1, 50),
                categoria=categoria,
                marca=random.choice(MARCAS),
                imagen=imagen_url,
                dimensiones=dimensiones,
                estado_disponibilidad=random.choice(ESTADOS),
                politica_devolucion=random.choice(POLITICAS),
                cantidad_minima=1,
                sku=sku,
            )

        for existing in existentes:
            existing.imagen = imagen_url
            existing.marca = random.choice(MARCAS)
            existing.estado_disponibilidad = random.choice(ESTADOS)
            existing.politica_devolucion = random.choice(POLITICAS)
            existing.save(update_fields=[
                'imagen',
                'marca',
                'estado_disponibilidad',
                'politica_devolucion',
            ])

        print(
            f'Categoria "{categoria.nombre}": creados {faltantes} productos, '
            f'actualizados {len(existentes)}.'
        )
