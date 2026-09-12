export type PlatformKey = 'windows' | 'mac' | 'linux';

export type DownloadId =
  | 'windows-exe'
  | 'windows-zip'
  | 'mac-dmg'
  | 'mac-zip'
  | 'linux-deb'
  | 'linux-appimage'
  | 'linux-rpm'
  | 'linux-targz';

interface DownloadDefinition {
  id: DownloadId;
  platform: PlatformKey;
  label: string;
  name: string;
  suffix: string;
  ext: string;
  icon: string;
  isPrimary?: boolean;
}

export interface DownloadItem extends DownloadDefinition {
  fileName: string;
  url: string;
}

export class ContainerStudioConfig {
  static readonly GITHUB_URL = 'https://github.com/catbee-technologies/catbee-container-studio';
  static readonly LATEST_RELEASE_URL = `${this.GITHUB_URL}/releases/latest`;
  static readonly MICROSOFT_STORE_PRODUCT_ID = '9NX6H3J2RNX2';
  static readonly MICROSOFT_STORE_URL = `https://apps.microsoft.com/detail/${this.MICROSOFT_STORE_PRODUCT_ID}?referrer=appbadge&mode=full`;

  static readonly DEFAULT_VERSION = 'v0.4.0';

  private static readonly DOWNLOAD_URL = `${this.GITHUB_URL}/releases/download`;

  private static readonly FILE_PREFIX = 'CatBee-Container-Studio';

  private static readonly DOWNLOADS: DownloadDefinition[] = [
    // Windows
    {
      id: 'windows-exe',
      platform: 'windows',
      label: 'Installer (.exe)',
      name: 'Windows x64 Installer',
      suffix: 'win-x64.exe',
      ext: '.exe',
      icon: 'devicon-windows11-original',
      isPrimary: true
    },
    {
      id: 'windows-zip',
      platform: 'windows',
      label: 'Portable (.zip)',
      name: 'Windows x64 Portable',
      suffix: 'win-x64.zip',
      ext: '.zip',
      icon: 'devicon-windows11-original'
    },

    // macOS
    {
      id: 'mac-dmg',
      platform: 'mac',
      label: 'Disk Image (.dmg)',
      name: 'macOS Universal (Intel + Apple Silicon)',
      suffix: 'mac-universal.dmg',
      ext: '.dmg',
      icon: 'devicon-apple-original',
      isPrimary: true
    },
    {
      id: 'mac-zip',
      platform: 'mac',
      label: 'Portable (.zip)',
      name: 'macOS Universal Archive',
      suffix: 'mac-universal.zip',
      ext: '.zip',
      icon: 'devicon-apple-original'
    },

    // Linux
    {
      id: 'linux-deb',
      platform: 'linux',
      label: 'Debian / Ubuntu (.deb)',
      name: 'Linux Debian / Ubuntu package',
      suffix: 'linux-amd64.deb',
      ext: '.deb',
      icon: 'devicon-linux-plain',
      isPrimary: true
    },
    {
      id: 'linux-appimage',
      platform: 'linux',
      label: 'AppImage (.AppImage)',
      name: 'Linux Universal AppImage',
      suffix: 'linux-x86_64.AppImage',
      ext: '.AppImage',
      icon: 'devicon-linux-plain'
    },
    {
      id: 'linux-rpm',
      platform: 'linux',
      label: 'Fedora / RHEL (.rpm)',
      name: 'Linux Fedora / RHEL / openSUSE',
      suffix: 'linux-x86_64.rpm',
      ext: '.rpm',
      icon: 'devicon-linux-plain'
    },
    {
      id: 'linux-targz',
      platform: 'linux',
      label: 'Tarball (.tar.gz)',
      name: 'Linux x64 Archive',
      suffix: 'linux-x64.tar.gz',
      ext: '.tar.gz',
      icon: 'devicon-linux-plain'
    }
  ];

  private static normalizeReleaseVersion(version: string): string {
    return version.startsWith('v') ? version : `v${version}`;
  }

  private static normalizeFileVersion(version: string): string {
    return version.replace(/^v/, '');
  }

  private static getFileName(version: string, suffix: string): string {
    return `${this.FILE_PREFIX}-${this.normalizeFileVersion(version)}-${suffix}`;
  }

  private static downloadUrl(version: string, fileName: string): string {
    return `${this.DOWNLOAD_URL}/${this.normalizeReleaseVersion(version)}/${fileName}`;
  }

  private static createDownload(definition: DownloadDefinition, version: string): DownloadItem {
    const fileName = this.getFileName(version, definition.suffix);

    return {
      ...definition,
      fileName,
      url: this.downloadUrl(version, fileName)
    };
  }

  static getPrimaryDownload(os: PlatformKey, version: string = this.DEFAULT_VERSION): DownloadItem {
    const definition = this.DOWNLOADS.find(({ platform, isPrimary }) => platform === os && isPrimary);
    if (!definition) {
      throw new Error(`Primary download not found for platform: ${os}`);
    }
    return this.createDownload(definition, version);
  }

  static getPlatformDownloads(os: PlatformKey, version: string = this.DEFAULT_VERSION): DownloadItem[] {
    return this.DOWNLOADS.filter(({ platform }) => platform === os).map(download =>
      this.createDownload(download, version)
    );
  }

  static getAllDownloads(version: string = this.DEFAULT_VERSION): Record<PlatformKey, DownloadItem[]> {
    return {
      windows: this.getPlatformDownloads('windows', version),
      mac: this.getPlatformDownloads('mac', version),
      linux: this.getPlatformDownloads('linux', version)
    };
  }

  /**
   * SSR-safe client OS detection
   */
  static detectOS(): PlatformKey {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return 'windows';
    }

    const nav = navigator as Navigator & {
      userAgentData?: {
        platform?: string;
      };
    };

    const uaPlatform = nav?.userAgentData?.platform?.toLowerCase() ?? '';

    if (uaPlatform.includes('win')) return 'windows';
    if (uaPlatform.includes('mac')) return 'mac';
    if (uaPlatform.includes('linux') || uaPlatform.includes('android')) {
      return 'linux';
    }

    const userAgent = navigator.userAgent.toLowerCase();
    const platform = navigator.platform.toLowerCase();

    if (platform.includes('win') || userAgent.includes('windows')) {
      return 'windows';
    }
    if (platform.includes('mac') || userAgent.includes('macintosh') || userAgent.includes('mac os')) {
      return 'mac';
    }
    if (platform.includes('linux') || userAgent.includes('linux') || userAgent.includes('x11')) {
      return 'linux';
    }

    return 'windows';
  }

  static getDownload(id: DownloadId, version: string = this.DEFAULT_VERSION): DownloadItem {
    const definition = this.DOWNLOADS.find(download => download.id === id);
    if (!definition) {
      throw new Error(`Download definition not found: ${id}`);
    }
    return this.createDownload(definition, version);
  }
}
