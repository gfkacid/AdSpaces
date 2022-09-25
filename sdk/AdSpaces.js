// AdSpaces.js
//
// The purpose of this library is:
// 1) to verify that and AdSpace owner has indeed access to its linked website
// 2) if verified, load ads 

// Create placeholder in DOM + load default banner
function createAdSpaceBanner(adspaceId, size, campaign){
    if(isNaN(adspaceId))return;
    var defaultAds = {
        wide: {cid: 'QmVbUXJKjLgPLpyuc7UpBS1zcEGgoMyLUzHk9xCLTKHWoR', link: 'https://adspaces.online/'},
        skyscraper: {cid: 'QmVbUXJKjLgPLpyuc7UpBS1zcEGgoMyLUzHk9xCLTKHWoR', link: 'https://adspaces.online/'},
        square: {cid: 'QmVbUXJKjLgPLpyuc7UpBS1zcEGgoMyLUzHk9xCLTKHWoR', link: 'https://adspaces.online/'},
    }
    var sizeDimensions = {
        wide: [728,90],
        skyscraper: [160,600],
        square: [200,200]
    }

    var ipfsGateway = 'https://ipfs.io/ipfs/'
    
    if(campaign == null){
        campaign = defaultAds[size];
    }
    
    var adSpace = document.createElement('div');
    adSpace.className = 'adspace-banner adspace-banner-'+size
    
    
    var banner = document.createElement('a')
    banner.setAttribute('href',campaign.link)
    banner.setAttribute('target','_blank')

    var image = document.createElement('img')
    image.src = ipfsGateway+campaign.cid

    banner.append(image)
    adSpace.append(banner)

    let wrapper = document.getElementById('adspace-'+adspaceId)
    
    wrapper.innerHTML = ''
    wrapper.append(adSpace)

    adSpace.style.maxWidth = sizeDimensions[size][0]+'px'
    adSpace.style.maxHeight = sizeDimensions[size][1]+'px'

    image.style.width = '100%'
    image.style.height = '100%'
}

// query api to check if verified, if so then load ads
function pingAdSpace(adSpaceId){
    if(isNaN(adSpaceId))return;
    let url = 'https://testnet.tableland.network/query?s=SELECT%20true%20FROM%20AdSpaces_420_88%20WHERE%20adspace_id%20=%20'+adSpaceId;
    
    //Check if AdSpace is verified by querying TableLand REST API
    fetch(url)
    .then(res => res.json())
    .then((out) => {
        console.log('Check if AdSpace is verified ', out)
        if(Array.isArray(out)){
            // AdSpace is verified, query tableLand for latest deal and show its ads
            let latestAdsURL = 'https://testnet.tableland.network/query?s=SELECT%20AdSpaces_420_111.size,Campaigns_420_112.cid,Campaigns_420_112.link%20FROM%20Deals_420_113%20JOIN%20Campaigns_420_112%20JOIN%20AdSpaces_420_111%20WHERE%20adspace_id%20=%20adspace_id_fk%20AND%20campaign_id%20=%20campaign_id_fk%20ORDER%20BY%20Deals_420_113.started_at%20DESC%20LIMIT%201'
            fetch(latestAdsURL)
            .then(res => res.json())
            .then((adToLoad) => {
                if(Array.isArray(adToLoad)){
                    console.log('inject this ad:',adToLoad[0])
                    createAdSpaceBanner(adSpaceId,adToLoad[0].size,adToLoad[0])
                }else{
                    console.log('no ad found, load default ad')
                    createAdSpaceBanner(adSpaceId,adToLoad[0].size,null)
                }
            })
        }else{
            // AdSpace not verified, trigger verification
            const verifyURL = 'https://api.adspaces.online/check-adspace?id='+adSpaceId
        }
    })
    .catch(err => { throw err });
}
