from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0011_producto_usuario'),
    ]

    operations = [
        migrations.AlterField(
            model_name='producto',
            name='imagen',
            field=models.TextField(),
        ),
    ]
