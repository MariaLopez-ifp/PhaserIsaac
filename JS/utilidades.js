export function collisionSwitch(obj, value) {
	obj.collideDown = value;
	obj.collideLeft = value;
	obj.collideRight = value;
	obj.collideUp = value;
}

export function convertToProperties(obj) {
	obj.properties = obj.data.list;
}

export function eliminarIndice(array, indice)
{
	var temp;

	for (var i = indice; i < array.lenght - 1; i++)
	{
		temp = array[i];
		array[i] = array[i + 1];
		array[i + 1] = temp;
	}

	array.pop();
}