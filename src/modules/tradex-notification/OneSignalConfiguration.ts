/* tslint:disable */
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
  operation?: string
}

export interface IButton {
  /**
   * Button ID.
   */
  id?: string;

  /**
   * Button text.
   */
  text?: string;

  /**
   * Button icon. Only works for Android.
   */
  icon?: string;

  /**
   * Button url. Only works for Chrome 48+.
   */
  url: string;
}

export interface IAndroidBackgroundLayout {
  /**
   * Asset file, android resource name, or URL to remote image.
   */
  image?: string;

  /**
   * Title text color ARGB Hex format. Example(Blue): {@code "FF0000FF"}.
   */
  headings_color?: string;

  /**
   * Body text color ARGB Hex format. Example(Red): {@code "FFFF0000"}
   */
  contents_color?: string;
}

export enum AndroidVisibility {
  PRIVATE = 0,
  DEFAULT = 1,
  SECRET = -1,
}

export enum IosBadgeType {
  NONE = "None",
  /**
   * Directly sets the badge count to the number specified in {@link Notification#iosBadgeCount}.
   */
  SET_TO = "SetTo",
  /**
   * Adds the number specified in {@link Notification#iosBadgeCount} to the total. Use a negative number to decrease
   * the badge count.
   */
  INCREASE = "Increase",
}

export enum DelayedOption {
  TIMEZONE = "timezone",
  /**
   * Deliver at the same time of day as each user last used your app.
   */
  LAST_ACTIVE = "last-active",
}

/**
 * look at here for more information {@link https://github.com/CurrencyFair/OneSignal-Java-SDK/blob/master/src/main/java/com/currencyfair/onesignal/model/notification/Notification.java}
 */
export default class OneSignalConfiguration implements IConfiguration {
  public domain: string;
  public id: string;
  public included_segments: string[];
  public excluded_segments: string[];
  public include_player_ids: string[];
  public app_ids: string[];
  public app_id: string;
  public template_id: string;
  public url: string;
  public big_picture: string;
  public adm_big_picture: string;
  public chrome_big_picture: string;
  public ios_category: string;
  public content_available: boolean;
  public mutable_content: boolean;
  public buttons: IButton;
  public web_buttons: IButton;
  public filters: IFilter[]
  /**
   * @code {"en": "English Message", "es": "Spanish Message"}
   */
  public contents: Map<string, string> = new Map<string, string>();
  /**
   * @code {"en": "English Title", "es": "Spanish Title"}
   */
  public headings: Map<string, string> = new Map<string, string>();
  /**
   * @code {"en": "English subTitle", "es": "Spanish subTitle"}
   */
  public subtitle: Map<string, string> = new Map<string, string>();
  public data: Map<string, string> = new Map<string, string>();
  public ios_attachments: Map<string, string> = new Map<string, string>();
  public android_background_layout: IAndroidBackgroundLayout;
  public amazon_background_data: string;
  public small_icon: string;
  public large_icon: string;
  public chrome_web_icon: string;
  public firefox_icon: string;
  public adm_small_icon: string;
  public adm_large_icon: string;
  public chrome_icon: string;
  public ios_sound: string;
  public android_sound: string;
  public adm_sound: string;
  public wp_sound: string;
  public wp_wns_sound: string;
  public android_led_color: string;
  public android_accent_color: string;
  public android_visibility: AndroidVisibility;
  public ios_badgeType: IosBadgeType;
  public ios_badgeCount: number;
  public collapse_id: string;
  /**
   * Schedule notification for future delivery.
   * <p>
   * Examples: All examples are the exact same date &amp; time.
   * <p>
   * {@code "Thu Sep 24 2015 14:00:00 GMT-0700 (PDT)"}
   * <p>
   * {@code "September 24th 2015, 2:00:00 pm UTC-07:00"}
   * <p>
   * {@code "2015-09-24 14:00:00 GMT-0700"}
   * <p>
   * {@code "Sept 24 2015 14:00:00 GMT-0700"}
   * <p>
   * {@code "Thu Sep 24 2015 14:00:00 GMT-0700 (Pacific Daylight Time)"}
   */
  public send_after: string;
  public delayed_option: DelayedOption;
  /**
   * Use with {@link DelayedOption#TIMEZONE}.
   * <p>
   * Example: {@code "9:00AM"}
   */
  public delivery_time_of_day: string;
  /**
   * Time To Live - In seconds. The notification will be expired if the device does not come back online within this
   * time. The default is 259,200 seconds (3 days).
   * <p>
   * iOS, ANDROID, CHROME, CHROMEWEB
   */
  public ttl: number;
  /**
   * Delivery priority through the push server (example GCM/FCM). Pass {@code 10} for high priority. Defaults to
   * normal priority for Android and high for iOS. For Android 6.0+ devices setting priority to high will wake the
   * device out of doze mode.
   * <p>
   * iOS, ANDROID, CHROME, CHROMEWEB
   */
  public priority: number;
  public android_group: string;
  // key is locale
  public android_group_message: Map<string, string> = new Map<string, string>();
  public adm_group: string;
  // key is locale
  public adm_group_message: Map<string, string> = new Map<string, string>();
  public isIos: boolean;
  public isAndroid: boolean;
  public isAnyWeb: boolean;
  public isChromeWeb: boolean;
  public isFirefox: boolean;
  public isSafari: boolean;
  public isWP: boolean;
  public isWP_WNS: boolean;
  public isAdm: boolean;
  public isChrome: boolean;

  public opened: boolean;
  public limit: number;
  public offset: number;

  public getMethod(): MethodEnum {
    return MethodEnum.ONESIGNAL;
  }
}