import IConfiguration from "./IConfiguration";
import MethodEnum from "./MethodEnum";
export interface IFilter {
    field: string;
    key: string;
    relation: string;
    value: string;
    radius?: string;
    latitude?: string;
    longitude?: string;
    operation?: string;
}
export interface IButton {
    id?: string;
    text?: string;
    icon?: string;
    url: string;
}
export interface IAndroidBackgroundLayout {
    image?: string;
    headings_color?: string;
    contents_color?: string;
}
export declare enum AndroidVisibility {
    PRIVATE = 0,
    DEFAULT = 1,
    SECRET = -1
}
export declare enum IosBadgeType {
    NONE = "None",
    SET_TO = "SetTo",
    INCREASE = "Increase"
}
export declare enum DelayedOption {
    TIMEZONE = "timezone",
    LAST_ACTIVE = "last-active"
}
export default class OneSignalConfiguration implements IConfiguration {
    domain: string;
    id: string;
    included_segments: string[];
    excluded_segments: string[];
    include_player_ids: string[];
    app_ids: string[];
    app_id: string;
    template_id: string;
    url: string;
    big_picture: string;
    adm_big_picture: string;
    chrome_big_picture: string;
    ios_category: string;
    content_available: boolean;
    mutable_content: boolean;
    buttons: IButton;
    web_buttons: IButton;
    filters: IFilter[];
    contents: Map<string, string>;
    headings: Map<string, string>;
    subtitle: Map<string, string>;
    data: Map<string, string>;
    ios_attachments: Map<string, string>;
    android_background_layout: IAndroidBackgroundLayout;
    amazon_background_data: string;
    small_icon: string;
    large_icon: string;
    chrome_web_icon: string;
    firefox_icon: string;
    adm_small_icon: string;
    adm_large_icon: string;
    chrome_icon: string;
    ios_sound: string;
    android_sound: string;
    adm_sound: string;
    wp_sound: string;
    wp_wns_sound: string;
    android_led_color: string;
    android_accent_color: string;
    android_visibility: AndroidVisibility;
    ios_badgeType: IosBadgeType;
    ios_badgeCount: number;
    collapse_id: string;
    send_after: string;
    delayed_option: DelayedOption;
    delivery_time_of_day: string;
    ttl: number;
    priority: number;
    android_group: string;
    android_group_message: Map<string, string>;
    adm_group: string;
    adm_group_message: Map<string, string>;
    isIos: boolean;
    isAndroid: boolean;
    isAnyWeb: boolean;
    isChromeWeb: boolean;
    isFirefox: boolean;
    isSafari: boolean;
    isWP: boolean;
    isWP_WNS: boolean;
    isAdm: boolean;
    isChrome: boolean;
    opened: boolean;
    limit: number;
    offset: number;
    getMethod(): MethodEnum;
}
