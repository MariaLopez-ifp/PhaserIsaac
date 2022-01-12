import * as utilidades from './utilidades.js';
import isaac from './isaac.js';


var portals = new Array();
var scene;


export function preload(s)
{
	scene = s;
}

export function create(capa)
{
	capa.forEach(obj => {

		if(obj.name == 'portal')
		{
			scene.physics.world.enable(obj);

			obj.setSize(4, 4)
			obj.setAlpha(0)

			obj.body.height = 4
			obj.body.width = 4

			obj.body.offset.x += 14
			obj.body.offset.y += 14

			createPortal(obj);
		}
	})

	createLinks(scene)

	return portals
}

function createPortal(obj)
{
	utilidades.convertToProperties(obj)
	obj.coolDown = 0

	portals.unshift(obj)
}

export function collisionPortal(obj)
{
	scene.physics.add.overlap(obj, portals, teleport, null, scene);
}

function teleport(entity, obj)
{
	entity.x = obj.destino.x
	entity.y = obj.destino.y + 35;
	entity.play('isaacF', true);
	entity.angulo = 90;
}

function createLinks()
{
	for (var i = 0; i < portals.length; i++) {
		var p = portals[i]
		
		p.linked=false;
		for (var e = 0; e < portals.length; e++)
		{
			var d = portals[e]
			if(p.properties.destino == d.properties.puerta)
			{
				p.destino=d
				p.linked=true;
			}
		}
		if(!p.linked)
		{
			p.destino=p
		}
	}
}