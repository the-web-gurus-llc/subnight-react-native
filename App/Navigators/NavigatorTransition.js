import { fromLeft, zoomIn, zoomOut } from 'react-navigation-transitions'

export const handleCustomTransition = ({ scenes }) => {
    const prevScene = scenes[scenes.length - 2];
    const nextScene = scenes[scenes.length - 1];

    // Custom transitions go there
    if (prevScene
        && prevScene.route.routeName === 'Intro'
        && nextScene.route.routeName === 'Verify') {
        return zoomIn();
    } else if (prevScene
        && prevScene.route.routeName === 'Login'
        && nextScene.route.routeName === 'Register') {
        return zoomOut();
    }
    return fromLeft();
}