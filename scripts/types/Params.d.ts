/**
 * @example
 * {
 *  	appOutDir: '/Users/username/Projects/MyApp/dist/mac',
 *  	outDir: '/Users/username/Projects/MyApp/dist',
 *  	electronPlatformName: 'darwin'
 *      packager: {
 *      	appInfo: {
 *      		productFilename: 'MyApp',
 *      		buildVersion: '1.0.0',
 *      		version: '1.0.0',
 *      		productName: 'MyApp'
 *      	}
 *      }
 *  }
 */
export type AfterSignHookParams = {
	appOutDir: string;
	outDir: string;
	electronPlatformName: 'darwin' | 'mas' | 'win32' | 'linux' | 'freebsd' | 'openbsd' | 'sunos';
	packager: Packager;
}

type Packager = {
	appInfo: {
		productFilename: string;
		buildVersion: string;
		version: string;
		productName: string;
	}
}