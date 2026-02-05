import React from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
const appCategories = [{
  name: 'Geoscience',
  path: '/dashboard/geoscience'
}, {
  name: 'Reservoir',
  path: '/dashboard/reservoir'
}, {
  name: 'Drilling',
  path: '/dashboard/drilling'
}, {
  name: 'Production',
  path: '/dashboard/production'
}, {
  name: 'Economics',
  path: '/dashboard/economic-project-management'
}, {
  name: 'Facilities',
  path: '/dashboard/facilities'
}];
const companyLinks = [{
  name: 'About Us',
  path: '/about-us'
}, {
  name: 'Careers',
  path: '/careers'
}];
const legalLinks = [{
  name: 'Terms of Service',
  path: '/legal/terms-of-service'
}, {
  name: 'Privacy Policy',
  path: '/legal/privacy-policy'
}, {
  name: 'Support',
  path: '/legal/support'
}, {
  name: 'Documentation',
  path: '/legal/documentation'
}];
const Footer = () => {
  const {
    toast
  } = useToast();
  const handleNewsletterSubmit = e => {
    e.preventDefault();
    toast({
      title: "📬 Subscribed!",
      description: "Thanks for joining our newsletter. Look out for updates in your inbox!"
    });
    e.target.reset();
  };
  const showToast = () => {
    toast({
      title: "🚧 This feature isn't implemented yet",
      description: "But don't worry! You can request it in your next prompt! 🚀"
    });
  };
  return <footer className="bg-slate-900 border-t border-slate-700 text-slate-400">
                <div className="container mx-auto px-6 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                        <div className="lg:col-span-2">
                            <Link to="/" className="flex items-center space-x-2 mb-4">
                                <img className="h-10 w-auto" alt="Petrolord - Energy Industry Management" src="https://horizons-cdn.hostinger.com/43fa5c4b-d185-4d6d-9ff4-a1d78861fb87/petrolord-symbol-text-iFUDK.png" />
                            </Link>
                            <p className="mb-4">The Digital Operating System for the Modern Energy Enterprise.</p>
                            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2 max-w-sm">
                                <Input type="email" placeholder="Enter your email" required className="bg-slate-800 border-slate-600 text-white" />
                                <Button type="submit" className="bg-gradient-to-r from-lime-500 to-green-600 hover:from-lime-600 hover:to-green-700 text-slate-900 font-bold">Subscribe</Button>
                            </form>
                        </div>

                        <div>
                            <p className="font-semibold text-slate-200 tracking-wider uppercase mb-4">Solutions</p>
                            <ul className="space-y-2">
                                {appCategories.map(category => <li key={category.name}>
                                        <Link to={category.path} className="hover:text-lime-300 transition-colors">
                                            {category.name}
                                        </Link>
                                    </li>)}
                            </ul>
                        </div>
                        
                        <div>
                            <p className="font-semibold text-slate-200 tracking-wider uppercase mb-4">Company</p>
                            <ul className="space-y-2">
                                {companyLinks.map(link => <li key={link.name}>
                                        <Link to={link.path} className="hover:text-lime-300 transition-colors">
                                            {link.name}
                                        </Link>
                                    </li>)}
                                <li>
                                    <Link to="/resources" className="hover:text-lime-300 transition-colors">
                                        Resources
                                    </Link>
                                </li>
                                <li>
                                    <span onClick={showToast} className="cursor-pointer hover:text-lime-300 transition-colors">Contact Us</span>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <p className="font-semibold text-slate-200 tracking-wider uppercase mb-4">Legal</p>
                            <ul className="space-y-2">
                                {legalLinks.map(link => <li key={link.name}>
                                        <Link to={link.path} className="hover:text-lime-300 transition-colors">
                                            {link.name}
                                        </Link>
                                    </li>)}
                            </ul>
                        </div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-slate-700 text-center">
                        <p>&copy; {new Date().getFullYear()} Lordsway Energy. All Rights Reserved.</p>
                    </div>
                </div>
            </footer>;
};
export default Footer;