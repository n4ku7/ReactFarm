import { promises as fs } from 'fs'
import { join } from 'path'

const file = join(process.cwd(), 'server', 'db.json')

const store = { data: { products: [], users: [], orders: [] } }

async function read() {
	try {
		const raw = await fs.readFile(file, 'utf8')
		store.data = JSON.parse(raw)
	} catch (err) {
		// initialize file with defaults
		store.data = { products: [], users: [], orders: [] }
		await write()
	}
}

async function write() {
	await fs.writeFile(file, JSON.stringify(store.data, null, 2), 'utf8')
}

export default {
	read,
	write,
	data: store.data,
	// provide setter/getter so other modules see latest data
	get data() {
		return store.data
	},
	set data(v) {
		store.data = v
	}
}
